var async = require("async")
    , path = require('path')
    , common = require('../common')
    , settings = require("../const/settings")
    , Account = require('../models/account')
    , Image = require("../models/image")
    , log = require('util').log
    , router = require('express').Router()
    , gm = require('gm')
    , imageMagick = gm.subClass({ imageMagick : true });

// 用户配置
router.get('/', function(req, res) {
    if (!req.user) {
        res.redirect('/');
    } else {
        res.redirect('/settings/emails');
    }
});

// 帐号设置
router.get('/account', function(req, res, next) {
    if (!req.user) {
        res.redirect('/signin');
    } else {
        res.render('pages/account', common.makeCommon({
            title: settings.APP_NAME,
            user : req.user,
            data: {
                info  : common.getFlash(req, 'info'),
                error : common.getFlash(req, 'error'),
                tab   : 'account'
            },
            success: 1
        }, res));
    }
});

// 邮箱设置
router.get('/emails', function(req, res, next) {
    if (!req.user) {
        res.redirect('/signin');
    } else {
        res.render('pages/emails', common.makeCommon({
            title: settings.APP_NAME,
            user : req.user,
            data: {
                info: common.getFlash(req, 'info'),
                error: common.getFlash(req, 'error'),
                tab   : 'emails'
            },
            success: 1
        }, res));
    }
});

// 更新密码
router.post('/account/pwdupdate', function(req, res, next) {
    if (!req.user) {
        res.redirect('/signin');
    }
    var username = req.user.username;

    if (!req.body || !req.body.password_old || !req.body.password_new) {
        var err = new Error("参数传递错误，密码更新失败！");
        return next(err);
    }

    var password_old = req.body.password_old;
    var password_new = req.body.password_new;

    Account.findByUsername(username, true, function(err, user) {
        if (err) {
            return next(err);
        }

        if (!user) {
            var err = new Error("网络或者服务器异常，更新密码失败！");
            return next(err);
        }

        user.updatePassword(password_old, password_new, function(err) {
            if (err) {
                req.flash('error', err.message);
                return res.redirect('/settings/account');
            }

            req.flash('info', "密码更新成功");
            res.redirect('/settings/account');
        });
    });
});

router.post('/emails/reverification', function(req, res) {
    if (!req.user) {
        return res.redirect('/signin');
    }

    var email = req.user.username;

    Account.resendVerificationEmail(req.protocol + '://' + settings.DOMAIN, email, function(err) {
        if (err) {
            var err = new Error("发送认证邮件失败, 请点击发送按钮重新发送。");
            req.flash('error', err.message);
            res.redirect('/settings/emails');
        }

        req.flash('info', "认证邮件已经发送至您的邮箱，请及时确认邮件并按步骤通过认证。");
        res.redirect('/settings/emails');
    });
});

router.post('/avatar/update', function(req, res) {
    if (!req.user) {
        return res.json({
            info: "请登录",
            result: 2
        });
    }

    const { user } = req;

    let { x, y, width, height, image } = req.body;

    image = image.trim();
    Image.findById(image, 'width height usage dir name', (err, doc) => {
        if (err) return res.json({
            info: err.message,
            result: 1
        });

        const file  = path.resolve(__dirname, '..' + doc.dir),
            miniFile = path.resolve(__dirname, '../picmini/' + doc.name),
            m_miniFile = path.resolve(__dirname, '../mpicmini/' + doc.name);

        imageMagick(file)
            .crop(width * doc.width, height * doc.height, x * doc.width, y * doc.height)
            .write(miniFile, function(err) {
                if (err) return res.json({
                    info: err.message,
                    result: 1
                });

                imageMagick(miniFile)
                    .scale(25, 25)
                    .write(m_miniFile, function(err) {
                        if (err) return res.json({
                            info: err.message,
                            result: 1
                        });

                        doc.usage = 1;
                        doc.save(function(err) {
                            if (err) return res.json({
                                info: err.message,
                                result: 1
                            });

                            user.avatar = '/picmini/' + doc.name;
                            user.avatar_mini = '/mpicmini/' + doc.name;
                            user.save(function(err) {
                                if (err) return res.json({
                                    info: err.message,
                                    result: 1
                                });

                                return res.json({
                                    info: "更新成功",
                                    data: {
                                        avatar: user.avatar
                                    },
                                    result: 0
                                });
                            });
                        });
                    });
            });
    });
});

module.exports = router;
