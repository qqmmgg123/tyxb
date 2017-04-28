var async = require("async")
    , common = require('../common')
    , settings = require("../const/settings")
    , Account = require('../models/account')
    , log = require('util').log
    , router = require('express').Router();

// 用户配置
router.get('/', function(req, res) {
    if (!req.user) {
        res.redirect('/signin');
    } else {
        res.redirect('/settings/profile');
    }
});

// 用户资料
router.get('/profile', function(req, res, next) {
    if (!req.user) {
        res.redirect('/signin');
    } else {
        res.render('pages/profile', common.makeCommon({
            title : settings.APP_NAME,
            data  : {
                info  : common.getFlash(req, 'info'),
                tab   : 'profile'
            },
            user  : req.user,
            success: 1
        }, res));
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

// 更改用户资料
router.post('/profile/update', function(req, res, next) {
    if (!req.user) {
        return res.redirect('/signin');
    }

    var uid = req.user.id;

    if (!req.body || !req.body.username) {
        var err = new Error("修改内容为空，个人信息更新失败！");
        return next(err);
    }
    var username = req.body.username,
        bio = req.body.bio? req.body.bio:'';

    req.user.update({
        username : username,
        bio      : bio
    }, function(err, course) {
        if (err) {
            return next(err);
        }

        req.flash('info', "个人信息更新完成。");
        res.redirect('/settings/profile');
    });
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

module.exports = router;
