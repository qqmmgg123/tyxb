var mongoose = require('mongoose');
var errorMessages = require('../const/errmsgs');
var async = require("async")
var crypto = require('crypto');
var LocalStrategy = require('passport-local').Strategy;
var errors = require('./errors.js');
var scmp = require('scmp');
var semver = require('semver');
var randtoken = require('rand-token');
var nodemailer = require('nodemailer');

var pbkdf2DigestSupport = semver.gte(process.version, '0.12.0');

module.exports = function(schema, options) {
    var saltlen            = 32,
        iterations         = 25000,
        keylen             = 512,
        encoding           = 'hex',
        digestAlgorithm    = 'sha256', // To get a list of supported hashes use crypto.getHashes()
        passwordValidator  = function(password, cb) { cb(null); },
        URLFieldName       = 'GENERATED_VERIFYING_URL',
        expirationTime     = 86400 * 7,
        URLLength          = 48,
        limitAttempts      = true;

    // email verification options
    var verificationURL    = 'http://www.suopoerath.com/email-verification/${URL}',
        transportOptions   = {
            host: 'smtp.mxhichina.com',
            port: 465,
            service: 'Aliyun',
            auth: {
                user: 'postmaster@suopoearth.com',
                pass: 'Qnmdwbd0000'
            }
        };

    var verifyMailOptions  = {
        from: '娑婆诃<postmaster@suopoearth.com>',
        subject: '娑婆诃邮箱认证邮件',
        html: '<p> 请点击 <a href="${URL}"> 这里 </a> 认证您的账号. 如果以上点击无效, 请拷贝以下链接，然后 ' +
            '黏贴该链接到您的浏览器地址栏，然后访问该链接，用以通过认证:</p><p>${URL}</p> <p>我们使用邮箱认证帐号原因是为了以后能更方便的通过邮箱联系到您，以便给您提供更多服务和帮助，如您忘记密码时可以通过邮箱重置密码。</p>',
        text: '请点击提供给您链接的认证通过您的账号，或者将链接拷贝至您的浏览器黏贴并访问，以便通过认证: ${URL}'
    };
    var shouldSendConfirmation = true,
        confirmMailOptions = {
            from: '娑婆诃 <postmaster@suopoearth.com>',
            subject: '邮箱认证成功',
            html: '<p>您的账号认证成功，感谢您的支持!</p>',
            text: '您的账号认证成功，感谢您的支持!'
        };

    // Populate field names with defaults if not set
    var usernameField  = 'username';
        usernameUnique = true;

    // Populate field email with defaults if not set
    var emailField  = 'email';
        emailUnique = true;

    var usernameQueryFields = [usernameField],
        emailQueryFields    = [emailField];

    // option to convert username to lowercase when finding
    var usernameLowerCase = true;

    var emailLowerCase = true;

    var hashField = 'hash',
        saltField = 'salt';

    // Limit attempts.
    var lastLoginField = 'last',
        attemptsField = 'attempts',
        interval = 100, // 100 ms
        maxInterval = 300000, // 5 min
        maxAttempts = Infinity;

    var pbkdf2 = function(password, salt, cb) {
        if (pbkdf2DigestSupport) {
            crypto.pbkdf2(password, salt, iterations, keylen, digestAlgorithm, cb);
        } else {
            crypto.pbkdf2(password, salt, iterations, keylen, cb);
        }
    };

    var schemaFields = {};

    if (!schema.path(usernameField)) {
        schemaFields[usernameField] = {type: String, unique: usernameUnique, required: true, trim: true, minlength: 2, maxlength: 24};
    }
    if (!schema.path(emailField)) {
        schemaFields[emailField] = {type: String, unique: emailUnique, required: true, trim: true, minlength: 1, maxlength: 50};
    }
    schemaFields[hashField] = {type: String, select: false};
    schemaFields[saltField] = {type: String, select: false};

    if (limitAttempts) {
        schemaFields[attemptsField] = {type: Number, default: 0};
        schemaFields[lastLoginField] = {type: Date, default: Date.now};
    }

    if (!schema.path(URLFieldName)) {
        schemaFields[URLFieldName] = String;
        schemaFields.isAuthenticated = false;
    }

    schemaFields.resetPasswordToken = String;
    schemaFields.resetPasswordExpires = Date;

    schema.add(schemaFields);

    var transporter = nodemailer.createTransport(transportOptions);

    if (usernameLowerCase) {
        schema.pre('save', function(next) {
            if (this[usernameField]) {
                this[usernameField] = this[usernameField].toLowerCase();
            }

            next();
        });
    }

    if (emailLowerCase) {
        schema.pre('save', function(next) {
            if (this[emailField]) {
                this[emailField] = this[emailField].toLowerCase();
            }

            next();
        });
    }

    schema.methods.setPassword = function(password, cb) {
        if (!password) {
            return cb(new errors.MissingPasswordError(errorMessages.MissingPasswordError));
        }

        var self = this;

        passwordValidator(password, function(err) {
            if (err) {
                return cb(err);
            }

            crypto.randomBytes(saltlen, function(randomBytesErr, buf) {
                if (randomBytesErr) {
                    return cb(randomBytesErr);
                }

                var salt = buf.toString(encoding);

                pbkdf2(password, salt, function(pbkdf2Err, hashRaw) {
                    if (pbkdf2Err) {
                        return cb(pbkdf2Err);
                    }

                    self.set(hashField, new Buffer(hashRaw, 'binary').toString(encoding));
                    self.set(saltField, salt);

                    cb(null, self);
                });
            });
        });
    };

    function authenticate(user, password, cb) {
        if (limitAttempts) {
            var attemptsInterval = Math.pow(interval, Math.log(user.get(attemptsField) + 1));
            var calculatedInterval = (attemptsInterval < maxInterval) ? attemptsInterval : maxInterval;

            if (Date.now() - user.get(lastLoginField) < calculatedInterval) {
                user.set(lastLoginField, Date.now());
                user.save();
                return cb(null, false, new errors.AttemptTooSoonError(errorMessages.AttemptTooSoonError));
            }

            if (user.get(attemptsField) >= maxAttempts) {
                return cb(null, false, new errors.TooManyAttemptsError(errorMessages.TooManyAttemptsError));
            }
        }

        if (!user.get(saltField)) {
            return cb(null, false, new errors.NoSaltValueStoredError(errorMessages.NoSaltValueStoredError));
        }

        pbkdf2(password, user.get(saltField), function(err, hashRaw) {
            if (err) {
                return cb(err);
            }

            var hash = new Buffer(hashRaw, 'binary').toString(encoding);

            if (scmp(hash, user.get(hashField))) {
                if (limitAttempts) {
                    user.set(lastLoginField, Date.now());
                    user.set(attemptsField, 0);
                    user.save();
                }
                return cb(null, user);
            } else {
                if (limitAttempts) {
                    user.set(lastLoginField, Date.now());
                    user.set(attemptsField, user.get(attemptsField) + 1);
                    user.save(function(saveErr) {
                        if (saveErr) { return cb(saveErr); }
                        if (user.get(attemptsField) >= maxAttempts) {
                            return cb(null, false, new errors.TooManyAttemptsError(errorMessages.TooManyAttemptsError));
                        } else {
                            return cb(null, false, new errors.IncorrectPasswordError(errorMessages.IncorrectPasswordError));
                        }
                    });
                } else {
                    return cb(null, false, new errors.IncorrectPasswordError(errorMessages.IncorrectPasswordError));
                }
            }
        });

    }

    // 更新密码
    schema.methods.updatePassword = function(password_old, password_new, cb) {
        var self = this;
        if (!this.get(saltField)) {
            var err = new errors.NoSaltValueStoredError(errorMessages.NoSaltValueStoredError);
            return cb(err);
        }

        pbkdf2(password_old, self.get(saltField), function(err, hashRaw) {
            if (err) {
                return cb(err);
            }

            var hash = new Buffer(hashRaw, 'binary').toString(encoding);

            if (scmp(hash, self.get(hashField))) {
                if (password_old == password_new) {
                    var err = new errors.PasswordSameError(errorMessages.PasswordSameError);
                    return cb(err);
                }

                self.setPassword(password_new, function(setPasswordErr, user) {
                    if (setPasswordErr) {
                        return cb(setPasswordErr);
                    }

                    self.save(function(saveErr) {
                        if (saveErr) {
                            return cb(saveErr);
                        }

                        cb(null);
                    });
                });
            } else {
                var err = new errors.IncorrectOldPasswordError(errorMessages.IncorrectOldPasswordError);
                return cb(err);
            }
        });
    }

    schema.methods.authenticate = function(password, cb) {
        var self = this;

        // With hash/salt marked as "select: false" - load model including the salt/hash fields form db and authenticate
        if (!self.get(saltField)) {
            self.constructor.findByUsername(self.get(usernameField), true, function(err, user) {
                if (err) { return cb(err); }

                if (user) {
                    return authenticate(user, password, cb);
                } else {
                    return cb(null, false, new errors.IncorrectUsernameError(errorMessages.IncorrectUsernameError));
                }
            });
        } else {
            return authenticate(self, password, cb);
        }
    };


    schema.methods.sendVerificationEmail = function(cb) {
        var r = /\$\{URL\}/g;
        var self = this;

        // inject newly-created URL into the email's body and FIRE
        // stringify --> parse is used to deep copy
        var url = self.get(URLFieldName);
        var URL = verificationURL.replace(r, url),
            mailOptions = JSON.parse(JSON.stringify(verifyMailOptions));

        mailOptions.to = self.get(emailField);
        mailOptions.html = mailOptions.html.replace(r, URL);
        mailOptions.text = mailOptions.text.replace(r, URL);

        transporter.sendMail(mailOptions, cb);
    };

    schema.methods.sendConfirmationEmail = function (cb) {
        var self = this;
        var mailOptions = JSON.parse(JSON.stringify(confirmMailOptions));
        mailOptions.to = self.get(emailField);
        transporter.sendMail(mailOptions, cb);
    };

    schema.statics.resendVerificationEmail = function (domain, email, cb) {
        if (domain) {
            verificationURL = domain + '/email-verification/${URL}';
        }

        var self = this;

        self.findByEmail(email, true, function(err, user) {
            if (err) {
                return cb(err);
            }

            // user found (i.e. user re-requested verification email before expiration)
            if (user) {
                // generate new user token
                user[URLFieldName] = randtoken.generate(URLLength);
                user.save(function(err) {
                    if (err) {
                        return cb(err);
                    }

                    user.sendVerificationEmail(function(err, info) {
                        if (err) {
                            return cb(err);
                        }
                        cb(null);
                    });
                });

            } else {
                return cb(null, false);
            }
        });
    };

    if (limitAttempts) {
        schema.methods.resetAttempts = function(cb) {
            this.set(attemptsField, 0);
            this.save(cb);
        };
    }

    schema.statics.authenticate = function() {
        var self = this;

        return function(username, password, cb) {
            self.findByUsername(username, true, function(err, user) {
                if (err) { return cb(err); }

                if (user) {
                    return user.authenticate(password, cb);
                } else {
                    return cb(null, false, new errors.IncorrectUsernameError(errorMessages.IncorrectUsernameError));
                }
            });
        };
    };

    schema.statics.serializeUser = function() {
        return function(user, cb) {
            cb(null, user.get(emailField));
        };
    };

    schema.statics.deserializeUser = function() {
        var self = this;

        return function(email, cb) {
            self.findByEmail(email, cb);
        };
    };

    function getNestedValue(obj, path, def) {
        var i, len;

        for (i = 0, path = path.split('.'), len = path.length; i < len; i++) {
            if (!obj || typeof obj !== 'object') {
                return def;
            }
            obj = obj[path[i]];
        }

        if (obj === undefined) {
            return def;
        }
        return obj;
    };

    schema.statics.register = function(user, password, cb) {
        // Create an instance of this in case user isn't already an instance
        if (!(user instanceof this)) {
            user = new this(user);
        }

        if (!user.get(usernameField)) {
            return cb(new errors.MissingUsernameError(errorMessages.MissingUsernameError));
        }

        if (!user.get(emailField)) {
            return cb(new errors.MissingEmailError(errorMessages.MissingEmailError));
        }

        var self = this;

        async.parallel([
            function(cb) {
                self.findByUsername(user.get(usernameField), function(err, existingUser) {
                    if (err) { return cb(err); }

                    if (existingUser) {
                        return cb(new errors.UserExistsError(errorMessages.UserExistsError));
                    }

                    cb(null);
                });
            },
            function(cb) {
                self.findByEmail(user.get(emailField), function(err, existingEmail) {
                    if (err) { return cb(err); }

                    if (existingEmail) {
                        return cb(new errors.UserExistsError(errorMessages.EmailExistsError));
                    }

                    cb(null);
                });
            }], function(err) {
                if (err) return cb(err);

                user.setPassword(password, function(setPasswordErr, user) {
                    if (setPasswordErr) {
                        return cb(setPasswordErr);
                    }

                    user.isAuthenticated = false;
                    user.save(function(saveErr) {
                        if (saveErr) {
                            return cb(saveErr);
                        }

                        cb(null, user);
                    });
                });
            });
    };

    schema.statics.forgot = function(domain, email, cb) {
        var self = this;

        crypto.randomBytes(20, function(err, buf) {
            var token = buf.toString('hex');

            self.findByEmail(email, function(err, user) {
                if (err) { return cb(err, null); }

                if (!user) {
                    var err = new errors.UserNotExistsError(errorMessages.UserNotExistsError);
                    return cb(err, null);
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                user.save(function(err) {
                    if (err) cb(err, null);

                    var mailOptions = {
                        to: user.email,
                        from: '娑婆诃 <postmaster@suopoearth.com>',
                        subject: '娑婆诃密码重置邮件',
                        html: '<p>该邮件用于为您的账号提供重置密码的请求链接.</p>' +
                        '<p>请点击 <a href="' + domain + '/reset/' + token + '">这里 </a>发送请求进行密码重置操作, 若点击无效请将以下链接拷贝黏贴到您浏览器的地址栏，并访问，以便完成密码重置操作:</p>' +
                        '<p>' + domain + '/reset/' + token + '</p>' +
                        '<p>如果您不做当前这一步操作，请忽略该邮件，您的密码不会有任何改变。</p>',
                        text: '该邮件用于为您的账号提供重置密码的请求链接.\n\n' +
                        '请点击提供给您的链接, 或者将该链接黏贴到您浏览器的地址栏，并访问，以便完成密码重置:\n\n' + domain + '/reset/' + token + '\n\n' +
                        '如果您不做当前这一步操作，请忽略该邮件，您的密码不会有任何改变。\n'
                    };

                    transporter.sendMail(mailOptions, cb);
                });
            });
        });
    }

    schema.statics.confirmTempUser  = function(url, cb) {
        var self = this;
        var query = {};

        query[URLFieldName] = url;

        self.findOne(query, function(err, user) {
            if (err) {
                return cb(err, null);
            }

            if (user) {
                user.isAuthenticated = true;
                user[URLFieldName] = undefined;
                user.save(function(err) {
                    if (err) {
                        return cb(err, null);
                    }

                    cb(null, user);
                });
            } else {
                return cb(new errors.TempUserNotFoundError(errorMessages.TempUserNotFoundError));
            }
        });
    };

    schema.statics.resetPassword = function(token, password, cb) {
        var self = this;

        self.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
            if (err) { return cb(err, null); }

            if (!user) {
                var err = new errors.UserNotExistsError(errorMessages.UserNotExistsError);
                return cb(err, null);
            }

            user.setPassword(password, function(setPasswordErr, user) {
                if (setPasswordErr) {
                    return cb(setPasswordErr, null);
                }

                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;
                user.save(function(saveErr) {
                    if (saveErr) {
                        return cb(saveErr, null);
                    }

                    cb(null, user);
                });
            });
        });
    };

    schema.statics.findByUsername = function(username, selectHashSaltFields, cb) {
        if (typeof cb === 'undefined') {
            cb = selectHashSaltFields;
            selectHashSaltFields = false;
        }

        // if specified, convert the username to lowercase
        if (username !== undefined && usernameLowerCase) {
            username = username.toLowerCase();
        }

        // Add each username query field
        var queryOrParameters = [];
        for (var i = 0; i < usernameQueryFields.length; i++) {
            var parameter = {};
            parameter[usernameQueryFields[i]] = username;
            queryOrParameters.push(parameter);
        }

        var query = this.findOne({$or: queryOrParameters});

        if (selectHashSaltFields) {
            query.select('+' + hashField + " +" + saltField);
        }

        if (cb) {
            query.exec(cb);
        } else {
            return query;
        }
    };

    schema.statics.findByEmail = function(email, selectHashSaltFields, cb) {
        if (typeof cb === 'undefined') {
            cb = selectHashSaltFields;
            selectHashSaltFields = false;
        }

        // if specified, convert the email to lowercase
        if (email !== undefined && emailLowerCase) {
            email = email.toLowerCase();
        }

        // Add each email query field
        var queryOrParameters = [];
        for (var i = 0; i < emailQueryFields.length; i++) {
            var parameter = {};
            parameter[emailQueryFields[i]] = email;
            queryOrParameters.push(parameter);
        }

        var query = this.findOne({$or: queryOrParameters});

        if (selectHashSaltFields) {
            query.select('+' + hashField + " +" + saltField);
        }

        if (cb) {
            query.exec(cb);
        } else {
            return query;
        }
    };
};

module.exports.errors = errors;
