var async = require("async")
    , common = require('./common')
    , crypto = require('crypto')
    , fs = require("fs")
    , path = require("path")
    , multer  = require('multer')
    , mime = require("mime")
    , settings = require("./const/settings")
    , errorMessages = require('./const/errmsgs')
    , errors = require('./models/errors')
    , mongoose = require('mongoose')
    , passport = require('passport')
    , Account = require('./models/account')
    , Dream = require("./models/dream")
    , Text     = require("./models/text")
    , Comment = require("./models/comment")
    , Tag     = require("./models/tag")
    , log = require('util').log
    , router = require('express').Router()
    , gm = require('gm')
    , imageMagick = gm.subClass({ imageMagick : true });

var storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
            if (err) return cb(err)

            cb(null, raw.toString('hex') + '.' + mime.extension(file.mimetype));
        });
    }
});

var upload = multer({ storage: storage });

// 展示推荐页
// 推荐页
function renderRecommand(req, res, next) {
    var role    = 1,
        page    = 1,
        order   = -1,
        limit   = 10,
        project = {
            _id       : 1,
            content   : 1,
            link      : 1,
            site      : 1,
            summary   : 1,
            category  : 1,
            cover     : 1,
            nodes     : 1,
            cnum   : { $size: '$comments' },
            _belong_u : 1,
            _belong_t : 1,
            date      : 1,
            isremove  : 1,
            vote: { 
                "$subtract": [ 
                    { "$size": "$good" },
                    { "$size": "$bad" }
                ]
            }
        };

        let user = req.user,
        uid = user? user._id:null;

    if (uid) {
        project.good = {
            $filter: {
                input: '$good',
                as   : 'uid',
                cond : { $eq: ['$$uid', uid] }
            }
        };
        project.bad = {
            $filter: {
                input: '$bad',
                as   : 'uid',
                cond : { $eq: ['$$uid', uid] }
            }
        };
        project._followers_u = {
            $filter: {
                input: '$_followers_u',
                as   : 'uid',
                cond : { $eq: ['$$uid', uid] }
            }
        };
    }

    if (req.query && req.query.p) {
        page = parseInt(req.query.p) || page;
    }

    if (req.query && req.query.o) {
        order = parseInt(req.query.o) || order;
    }

    if (req.query && req.query.r) {
        role = parseInt(req.query.r) || role;
    }

    var sort = null;
    switch(role) {
        case settings.SORT_ROLE.HOT:
            project.hot = {
                '$let': {
                    vars: {
                        time : {
                            "$subtract": [
                                "$date",
                                new Date("1970-01-01")
                            ]
                        },
                        score: {
                            "$subtract": [ 
                                { "$size": "$good" },
                                { "$size": "$bad" }
                            ]
                        }
                    },
                    in: common.hotSort()
                }
            }
            sort    = { hot: order };
            break;
        case settings.SORT_ROLE.NEW:
            sort = { date: order };
            break;
    }

    var skip = (page - 1) * 10;

    // 查询耗时测试
    var start = new Date().getTime();
    
    async.parallel([
        function(cb) {
            Dream.aggregate([{
                $project: project
            }, {
                $sort: sort
            }, {
                $skip: skip
            }, {
                $limit: limit + 1
            }], function(err, dreams) {
                if (err) {
                    return cb(err, []);
                }

                Account.populate(dreams, [{ 
                    path: '_belong_u',
                    select: '_id username avatar_mini',
                    option: { lean: true },
                    model: Account
                }], function(err, dreams) {
                    if (err) {
                        return cb(err, []);
                    }

                    Tag.populate(dreams, { 
                        path: '_belong_t',
                        select: "_id key",
                        option: { lean: true },
                        model: Tag
                    }, function(err, dreams) {
                        if (err) {
                            return cb(err, []);
                        }

                        cb(null, dreams);
                    });
                });
            });
        },
        function(cb) {
            Tag.aggregate([{
                $project: {
                    _id       : 1,
                    key       : 1,
                     weight    : 1,
                     hot       : {
                         '$let': {
                             vars: {
                                 time : {
                                     "$subtract": [
                                         "$date",
                                         new Date("1970-01-01")
                                     ]
                                 },
                                 score: { $size: '$followers' }
                             },
                             in: common.hotSort()
                         }
                     }
                 }
             }, {
                 $sort: { weight: -1, hot: -1 }
             }, {
                 $limit: 11
             }], function(err, tags) {
                if (err) {
                    return cb(err, []);
                }
                
                cb(null, tags);
             });
        }, function(cb) {
             Account.aggregate([{
                 $project: {
                     _id         : 1,
                     avatar_mini : 1,
                     username    : 1,
                     bio         : 1
                 }
             }, {
                 $sort: { date: -1 }
             }, {
                 $limit: 11
             }], function(err, users) {
                if (err) {
                    return cb(err, []);
                }
                
                cb(null, users);
             });
        }], function(err, results) {
            if (err && results.length < 3) {
                return next(err);
            }

            var dreams    = results[0],
                tags      = results[1],
                users     = results[2];

            var hasmore = false,
                hasprev = false;
            if (dreams.length > 0) {
                if (page > 1) {
                    hasprev = true;
                }
                if (dreams[10]) {
                    hasmore = true;
                }
                dreams = dreams.slice(0, 10);
            }

            var prev = Math.max(page - 1, 1),
                pnext = page + 1;

            res.render('pages/index_unlogged', common.makeCommon({
                title: settings.APP_NAME,
                notice: common.getFlash(req, 'notice'),
                user : req.user,
                data: {
                    tags    : tags,
                    users   : users,
                    dreams  : dreams,
                    hasprev : hasprev,
                    hasmore : hasmore,
                    role    : role,
                    order   : order,
                    prev    : prev,
                    next    : pnext,
                    nav     : 'home',
                    domain  : req.get('origin') || req.get('host')
                },
                success: 1
            }, res));

            var end = new Date().getTime(),
                spend = end - start;
            if (spend > common.maxtime) {
                console.log(req.originalUrl + ' spend' + spend + 'ms');
            }
        });
};

// 订阅页
function renderSubscription(req, res, next) {
    // 确定显示规则逻辑
    let user = req.user, 
        uid = user._id,
        role    = 1,
        page    = 1,
        order   = -1,
        limit   = 10,
        project = {
            _id       : 1,
            content   : 1,
            summary   : 1,
            link      : 1,
            site      : 1,
            nodes     : 1,
            cnum   : { $size: '$comments' },
            _belong_u : 1,
            _belong_t : 1,
            date      : 1,
            isremove  : 1,
            vote: { 
                "$subtract": [ 
                    { "$size": "$good" },
                    { "$size": "$bad" }
                ]
            }
        };

    project.good = {
        $filter: {
            input: '$good',
            as   : 'uid',
            cond : { $eq: ['$$uid', uid] }
        }
    };
    project.bad = {
        $filter: {
            input: '$bad',
            as   : 'uid',
            cond : { $eq: ['$$uid', uid] }
        }
    };
    project._followers_u = {
        $filter: {
            input: '$_followers_u',
            as   : 'uid',
            cond : { $eq: ['$$uid', uid] }
        }
    };

    if (req.query && req.query.p) {
        page = parseInt(req.query.p) || page;
    }

    if (req.query && req.query.o) {
        order = parseInt(req.query.o) || order;
    }

    if (req.query && req.query.r) {
        role = parseInt(req.query.r) || role;
    }

    var sort = null;
    switch(role) {
        case settings.SORT_ROLE.HOT:
            project.hot = {
                '$let': {
                    vars: {
                        time : {
                            "$subtract": [
                                "$date",
                                new Date("1970-01-01")
                            ]
                        },
                        score: {
                            "$subtract": [ 
                                { "$size": "$good" },
                                { "$size": "$bad" }
                            ]
                        }
                    },
                    in: common.hotSort()
                }
            }
            sort    = { hot: order };
            break;
        case settings.SORT_ROLE.NEW:
            sort = { date: order };
            break;
    }

    var skip = (page - 1) * 10;

    // 查询耗时测试
    var start = new Date().getTime();

    async.parallel([
        function(cb) {
            Dream.aggregate([{
                $match: {
                    _belong_t: {
                        $in: user.follow_tags
                    }
                }
            }, {
                $project: project
            }, {
                $sort: sort
            }, {
                $skip: skip
            }, {
                $limit: limit + 1
            }], function(err, dreams) {
                if (err) {
                    return cb(err, []);
                }

                Account.populate(dreams, [{ 
                    path: '_belong_u',
                    select: '_id username avatar_mini',
                    option: { lean: true },
                    model: Account
                }], function(err, dreams) {
                    if (err) {
                        return cb(err, []);
                    }

                    Text.populate(dreams, { 
                        path: 'text',
                        select: 'summary images',
                        option: { lean: true },
                        model: Text
                    }, function(err, dreams) {
                        if (err) {
                            return cb(err, []);
                        }

                        Tag.populate(dreams, { 
                            path: '_belong_t',
                            select: "_id key",
                            option: { lean: true },
                            model: Tag
                        }, function(err, dreams) {
                            if (err) {
                                return next(err, []);
                            }

                            cb(null, dreams);
                        });
                    });
                });
            });
        },
        function(cb) {
            Tag.aggregate([{
                $match: {
                    _id: {
                        $in: user.follow_tags
                    }
                }
            }, {
                 $project: {
                     _id       : 1,
                     key       : 1,
                     weight    : 1,
                     hot       : {
                         '$let': {
                             vars: {
                                 time : {
                                     "$subtract": [
                                         "$date",
                                         new Date("1970-01-01")
                                     ]
                                 },
                                 score: { $size: '$followers' }
                             },
                             in: common.hotSort()
                         }
                     }
                 }
             }, {
                 $sort: { weight: -1, hot: -1 }
             }, {
                 $limit: 11
             }], function(err, tags) {
                if (err || !tags) {
                    var unKonwErr = new Error('未知错误。')
                    return cb(err || unKonwErr, []);
                }
                
                cb(null, tags);
             });
        }], function(err, results) {
            if (err && results.length < 2) {
                return next(err);
            }

            var dreams    = results[0],
                tags      = results[1];

            var hasmore = false,
                hasprev = false;
            if (dreams.length > 0) {
                if (page > 1) {
                    hasprev = true;
                }
                if (dreams[10]) {
                    hasmore = true;
                }
                dreams = dreams.slice(0, 10);
            }

            var prev = Math.max(page - 1, 1),
                pnext = page + 1;

            res.render('pages/index_logged', common.makeCommon({
                user: req.user,
                title: settings.APP_NAME,
                notice: common.getFlash(req, 'notice'),
                data: {
                    tags       : tags,
                    dreams     : dreams,
                    hasprev : hasprev,
                    hasmore : hasmore,
                    role    : role,
                    order   : order,
                    prev    : prev,
                    next    : pnext,
                    nav     : 'subscription',
                    domain  : req.get('origin') || req.get('host')
                },
                success: 1
            }, res));

            var end = new Date().getTime(),
                spend = end - start;
            if (spend > common.maxtime) {
                console.log(req.originalUrl + ' spend' + spend + 'ms');
            }
        });
}

// 网站页
function renderSite(req, res, next) {
    let domain  = req.params.domain;

    // 确定显示规则逻辑
    let role    = 1,
        page    = 1,
        order   = -1,
        limit   = 10,
        project = {
            _id       : 1,
            content   : 1,
            summary   : 1,
            link      : 1,
            site      : 1,
            nodes     : 1,
            //cnum   : { $size: '$comments' },
            _belong_u : 1,
            _belong_t : 1,
            date      : 1,
            isremove  : 1,
            vote: { 
                "$subtract": [ 
                    { "$size": "$good" },
                    { "$size": "$bad" }
                ]
            }
        };

    let user = req.user,
        uid = user? user._id:null;

    if (uid) {
        project.good = {
            $filter: {
                input: '$good',
                as   : 'uid',
                cond : { $eq: ['$$uid', uid] }
            }
        };
        project.bad = {
            $filter: {
                input: '$bad',
                as   : 'uid',
                cond : { $eq: ['$$uid', uid] }
            }
        };
        project._followers_u = {
            $filter: {
                input: '$_followers_u',
                as   : 'uid',
                cond : { $eq: ['$$uid', uid] }
            }
        };
    }

    if (req.query && req.query.p) {
        page = parseInt(req.query.p) || page;
    }

    if (req.query && req.query.o) {
        order = parseInt(req.query.o) || order;
    }

    if (req.query && req.query.r) {
        role = parseInt(req.query.r) || role;
    }

    var sort = null;
    switch(role) {
        case settings.SORT_ROLE.HOT:
            project.hot = {
                '$let': {
                    vars: {
                        time : {
                            "$subtract": [
                                "$date",
                                new Date("1970-01-01")
                            ]
                        },
                        score: {
                            "$subtract": [ 
                                { "$size": "$good" },
                                { "$size": "$bad" }
                            ]
                        }
                    },
                    in: common.hotSort()
                }
            }
            sort    = { hot: order };
            break;
        case settings.SORT_ROLE.NEW:
            sort = { date: order };
            break;
    }

    var skip = (page - 1) * 10;

    // 查询耗时测试
    var start = new Date().getTime();

    async.parallel([
        function(cb) {
            Dream.aggregate([{
                $match: {
                    site: domain
                }
            }, {
                $project: project
            }, {
                $sort: sort
            }, {
                $skip: skip
            }, {
                $limit: limit + 1
            }], function(err, dreams) {
                if (err) {
                    return cb(err, []);
                }

                Account.populate(dreams, [{ 
                    path: '_belong_u',
                    select: '_id username avatar_mini',
                    option: { lean: true },
                    model: Account
                }], function(err, dreams) {
                    if (err) {
                        return cb(err, []);
                    }

                    Tag.populate(dreams, { 
                        path: '_belong_t',
                        select: "_id key",
                        option: { lean: true },
                        model: Tag
                    }, function(err, dreams) {
                        if (err) {
                            return next(err, []);
                        }

                        cb(null, dreams);
                    });
                });
            });
        },
        function(cb) {
            Tag.aggregate([{
                $match: {
                    _id: {
                        $in: user.follow_tags
                    }
                }
            }, {
                 $project: {
                     _id       : 1,
                     key       : 1,
                     weight    : 1,
                     hot       : {
                         '$let': {
                             vars: {
                                 time : {
                                     "$subtract": [
                                         "$date",
                                         new Date("1970-01-01")
                                     ]
                                 },
                                 score: { $size: '$followers' }
                             },
                             in: common.hotSort()
                         }
                     }
                 }
             }, {
                 $sort: { weight: -1, hot: -1 }
             }, {
                 $limit: 11
             }], function(err, tags) {
                if (err || !tags) {
                    var unKonwErr = new Error('未知错误。')
                    return cb(err || unKonwErr, []);
                }
                
                cb(null, tags);
             });
        }], function(err, results) {
            if (err && results.length < 2) {
                return next(err);
            }

            var dreams    = results[0],
                tags      = results[1];

            var hasmore = false,
                hasprev = false;
            if (dreams.length > 0) {
                if (page > 1) {
                    hasprev = true;
                }
                if (dreams[10]) {
                    hasmore = true;
                }
                dreams = dreams.slice(0, 10);
            }

            var prev = Math.max(page - 1, 1),
                pnext = page + 1;

            res.render('pages/site', common.makeCommon({
                user: req.user,
                title: settings.APP_NAME,
                notice: common.getFlash(req, 'notice'),
                data: {
                    tags       : tags,
                    dreams     : dreams,
                    hasprev : hasprev,
                    hasmore : hasmore,
                    role    : role,
                    order   : order,
                    prev    : prev,
                    next    : pnext,
                    site    : domain,
                    domain  : req.get('origin') || req.get('host')
                },
                success: 1
            }, res));

            var end = new Date().getTime(),
                spend = end - start;
            if (spend > common.maxtime) {
                console.log(req.originalUrl + ' spend' + spend + 'ms');
            }
        });
}

// 首页
router.get('/', function(req, res, next) {
    req.session.redirectTo = req.originalUrl;

    // 到推荐页
    renderRecommand(req, res, next);
});

// 我的订阅
router.get('/subscription', function(req, res, next) {
    req.session.redirectTo = '/subscription';

    const user = req.user;

    if (!user) {
        return res.redirect('/');
    }

    // 到订阅页
    renderSubscription(req, res, next);
});

// 网站页
router.get('/site/:domain([^\/]+)', function(req, res, next) {
    req.session.redirectTo = req.originalUrl;

    // 到网站页
    renderSite(req, res, next);
});

// 简介
router.get('/intro', function(req, res) {
    res.render('pages/intro', common.makeCommon({
        title: settings.APP_NAME,
        notice: common.getFlash(req, 'notice'),
        user : req.user,
        data: {
        },
        success: 1
    }, res));
});

// 联系我们
router.get('/contact', function(req, res) {
    res.render('pages/contact', common.makeCommon({
        title: settings.APP_NAME,
        notice: common.getFlash(req, 'notice'),
        user : req.user,
        data: {
        },
        success: 1
    }, res));
});

// 登录
router.post('/signin', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return res.json({
                info: err.message,
                result: 3
            });
        }
        if (!user) {
            return res.json({
                info: info.message,
                result: 3
            });
        }
        req.logIn(user, function(err) {
            if (err) { return next(err); }

            res.json({
                info: '登录成功',
                result: 0
            });
        });
    })(req, res, next);
});

// 注册
router.post('/signup', function(req, res, next) {
    if (!req.body) {
        return res.json({
            info: settings.PARAMS_PASSED_ERR_TIPS,
            result: 3
        });
    }

    const { tag = '', username = '', email = '', password = '' } = req.body;

    Account.register(new Account({
        username : username.trim(),
        email    : email.trim()
    }), password.trim(), function(err, user) {
        if (err) {
            return res.json({
                info: err.message,
                result: 3
            });
        }

        let uid = user._id;

        let fields = {
            key         : tag.trim(),
            _create_u   : uid,
            president   : uid,
            followers   : [uid],
            permissions : [mongoose.Types.ObjectId(settings.PERMS.DREAM_REMOVE)]
        };
        
        // 创建小报
        Tag.create(fields, function(err, tag) {
            if (err) {
                return res.json({
                    info: err.message,
                    result: 3
                });
            }

            var tid = tag._id;
            Account.update({ '_id': uid }, 
                { 
                    $addToSet: { 'follow_tags' : tid } 
                } 
            ).exec((err, ret) => {
                if (err) return res.json({
                    info: err.message,
                    result: 3
                });
                
                passport.authenticate('local')(req, res, function() {
                    if (err) {
                        return res.json({
                            info: err.message,
                            result: 3
                        });
                    }

                    res.json({
                        info: '注册成功',
                        result: 0
                    });
                });
            });
        });
    });
});

// 发送重置邮件
router.post('/forgot', function(req, res, next) {
    if (!req.body || !req.body.email || !req.body.email.trim()) {
        var err = new Error("参数传递错误，密码重置失败！");
        return next(err);
    }

    Account.forgot(req.body.email.trim(), function(err, info) {
        if (err) {
            return res.json({
                info: err.message,
                result: 3
            });
        }

        res.json({
            info: '验证码发送成功',
            result: 0
        });
    });
});

// 重置密码
router.post('/reset', function(req, res, next) {
    function resFailed(err) {
        res.json({
            info: err.message,
            result: 3
        });
    }

    if (!req.body || !req.body.password || 
        !req.body.token || !req.body.password.trim() || 
        !req.body.token.trim()) {
        var err = new Error("参数传递错误，密码重置失败！");
        return next(err);
    }

    Account.resetPassword(req.body.token.trim(), req.body.password.trim(), function(err, user) {
        if (err) {
            let err = new Error("验证码过期, 请重新发送");
            resFailed(err);
        }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            res.json({
                info: "密码重置成功",
                result: 0
            });
        });
    });
});

// 登出
router.get('/signout', function(req, res) {
    res.clearCookie('remember_me');
    req.logout();

    if (req.xhr) {
        res.json({
            info: '退出成功',
            result: 0
        });
    }
    else{
        var redirectTo = req.session.redirectTo ? req.session.redirectTo : '/';
        delete req.session.redirectTo;
        res.redirect(redirectTo);
    }
});

// 上传并缓存图片
router.post('/pic/upload', upload.single('pic'), function(req, res, next) {
    if (!req.user) {
        return res.json({
            info: "请登录",
            result: 2
        });
    }

    var uid = req.user._id;

    var file     = __dirname + '/public/pic/' + req.file.filename;
    var miniFile = __dirname + '/public/picmini/' + req.file.filename;

    var path = req.file.path;
    var sz   = req.file.size;
    var type = req.file.mimetype;

    if (sz > 2*1024*1024) {
        fs.unlink(path, function() {
            res.json({
                info: 'image size too large',
                result: 1
            });
        });
    } else if (type.split('/')[0] != 'image') {
        fs.unlink(path, function() {
            res.json({
                info: 'image type wrong',
                result: 1
            });
        });
    } else {
        imageMagick(path).size(function(err, value){
            // note : value may be undefined
            if (err || !value) {
                return fs.unlink(path, function() {
                    next(err || new Error('Image size undefined.'));
                });
            }

            if (value.width >= 600) {

            imageMagick(path)
                .scale(600)
                .write(file, function(err){
                    if (err) {
                        return fs.unlink(path, function() {
                            next(err);
                        });
                    }
                    imageMagick(file)
                        .scale(150, 150)
                        .write(miniFile, function(err){
                            if (err) {
                                return fs.unlink(path, function() {
                                    next(err);
                                });
                            }

                            fs.unlink(path, function() {
                                res.json({
                                    info: 'img save successfully',
                                    dataUrl: '/pic/' + req.file.filename,
                                    result: 0
                                });
                            });
                        });
                });

            }else{
                fs.rename(path, file, function(err) {
                    if (err) {
                        return fs.unlink(path, function(err) {
                            next(err);
                        });
                    }

                    imageMagick(file)
                        .scale(150, 150)
                        .write(miniFile, function(err){
                            if (err) {
                                return fs.unlink(path, function() {
                                    next(err);
                                });
                            }

                            fs.unlink(path, function() {
                                res.json({
                                    info: 'img save successfully',
                                    dataUrl: '/pic/' + req.file.filename,
                                    result: 0
                                });
                            });
                        });
                });
            }
        });
    }
});

module.exports = router;
