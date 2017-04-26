var req = require('req').default;
var settings = require('../const/settings');
var utils   = require('utils');

class Validate {
    constructor(opts) {
        this.opts = opts;
        this.defValidates = {
            'username': {
                'fun': function(val) {
                    return utils.isUserName(val);
                },
                'err': "昵称必须是6~12个小写字母、数字、下划线组成"
            },

            'email': {
                'fun': function(val) {
                    return utils.isValidEmail(val);
                },
                'err': "邮箱的格式书写错误"
            },

            'nickname': {
                'fun': function(val) {
                    return utils.isNickName(val);
                },
                'err': '笔名' + settings.NICK_NAME_VALIDATION
            },

            'password': {
                'fun': function(val) {
                    return utils.isPassword(val);
                },
                'err': "密码必须是6~16个字符的小写字母或数字组成"
            }
        };
        this.init();
    }

    init() {
        var opts = this.opts || {};
        this.defaultOpts = {
            form: '#signup-form',
            fields: [
                { name: 'email', require: true, label: '邮箱' },
                { name: 'nickname', require: true, label: '笔名' },
                { name: 'password',  require: true, label: '密码' }
            ],
            onCheckInput: function() {
                var self = this;
                req.post(
                    '/signup/check',
                    { 
                        email: self.formData.email
                    },
                    function(data) {
                        if (data.result === 0) {
                            self.form.style.display = 'none';
                            self.form.nextElementSibling.style.display = 'block';
                            self.form.submit();
                        } else {
                            var infoBox = self.form.querySelector('#signupInfo');
                            infoBox && (infoBox.innerHTML = data.info);
                            infoBox && (infoBox.style.display = "block");
                        }
                    }
                );
            },
            needP: false
        }

        this.settings = {};
        this.setOpts(opts);
        this.create();
    }

    setOpts(opts) {
        for (var o in this.defaultOpts) {
            this.settings[o] = typeof opts[o] !== 'undefined'? opts[o]:this.defaultOpts[o];
        }
    }

    updateSettings(opts) {
        for (var o in opts) {
            if (typeof this.settings[o] !== 'undefined') {
                this.settings[o] = opts[o];
            }
        }
    }

    create() {
        var conf = this.settings;

        for (var o in conf) {
            switch (o.toLowerCase()) {
                case 'form':
                    if (conf[o].nodeType && conf[o].nodeType === 1) this[o] = conf[o];
                    else if (typeof conf[o] == 'string') this.form = document.querySelector(conf[o]);
                    else throw new Error('Form element pass Error.');
                    break;
                default:
                    this[o] = conf[o];
                    break;
            }
        }

        if (!this.form) throw new Error('There is no form element.');
        this.bindEvents();
    }

    validate() {
        var self = this, formData = {}, validate = true;
        this.form && this.form.querySelectorAll('input').forEach(function(inp) {
            var val    = inp.value,
                field  = utils.closest(inp, '.field'),
                tips   = field && field.nextElementSibling;

            if (!tips) {
                validate = false;
                return;
            }

            // 判断是否有效
            self.fields && self.fields.forEach(function(field) {
                var name = field.name,
                    label = field.label;
                if (name === inp.name) {
                    val = val.trim();

                    // 判断是否为空
                    if (field.require) {
                        if (val.length === 0) {
                            tips.innerHTML = field.empty_msg || (label + "未填写");
                            tips.style.display = 'block';
                            validate = false;
                            return;
                        }else{
                            tips.innerHTML = '';
                            tips.style.display = 'none';
                        }
                    }

                    var isValid  = true,
                        errorText = "";
                    if (field.fun) {
                        if (!field.fun(val)) {
                            validate = false;
                            isValid  = false;
                            errorText = field.err || '';
                        }
                    }else{
                        var defv = self.defValidates[name];
                        if (defv) {
                            if (!defv.fun(val)) {
                                validate = false;
                                isValid = false;
                                errorText = defv.err || '';
                            }
                        }
                    }
                    if (!isValid) {
                        tips.style.display = 'block';
                        tips.innerHTML = errorText;
                        validate = false;
                        return;
                    }else{
                        tips.innerHTML = '';
                        tips.style.display = 'none';
                    }
                }
            });

            formData[inp.name] = val;
        });

        if (validate) {
            this.formData = formData;
            this.onCheckInput && this.onCheckInput();
        }
    }

    bindEvents() {
        this.submitBtn = this.form.querySelector('button')

        this.submitBtn && this.submitBtn
            .addEventListener('click', this.validate.bind(this), false);

        if (this.needP) utils.placeholder(this.form);
    }

};

function validate(opts) {
    return new Validate(opts);
}

export { validate };
