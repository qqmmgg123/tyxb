var router = require('express').Router()
,   async = require("async")
,   settings = require("../const/settings")
,   mongoose = require('mongoose')
,   common = require("../common")
,   settings = require("../const/settings")
,   Account  = require('../models/account')
,   Tag    = require('../models/tag')
,   Permission = require('../models/permission')
,   Dream  = require('../models/dream')
,   log = require('util').log
,   Text  = require('../models/text');

router.get('/', function(req, res, next) {
    if (!req.user) {
        return res.redirect('/tag/hot');
    }

    res.redirect('/tag/mine');
});

// 获取所有订阅
router.post('/new', function(req, res, next) {
    if (!req.user) {
        return res.redirect('/signin');
    }

    var user = req.user,
        uid  = user._id;

    Tag.count({ _create_u: uid }, function(err, num) {
        if (err) return next(err);

        if (num >= 3) {
            return next(new Error(settings.TAG_MORE_ERR));
        }

        Tag.validation(req, function(err, formData) {
            if (err) return next(err);

            var fields = {
                key         : formData.key,
                _create_u   : uid,
                president   : uid,
                followers   : [uid],
                permissions : [mongoose.Types.ObjectId(settings.PERMS.DREAM_REMOVE)]
            };

            var desc = formData.description;
            if (desc && typeof desc === 'string') {
                fields.description = desc
            }

            // 查询耗时测试
            var start = new Date().getTime();

            Tag.create(fields, function(err, tag) {
                if (err || !tag) {
                    var unKonwErr = new Error('未知错误。')
                    return next(err || unKonwErr, []);
                }

                var tid = tag._id;
                Account.update({ '_id': uid }, 
                    { 
                        $addToSet: { 'follow_tags' : tid } 
                    } 
                ).exec((err, ret) => {
                    if (err) return next(err);
                    
                    res.redirect('/tag/' + tag._id);

                    var end = new Date().getTime(),
                        spend = end - start;
                    if (spend > common.maxtime) {
                        console.log(req.originalUrl + ' spend' + spend + 'ms');
                    }
                });
            });
        });
    });
});

// 获取所有订阅
router.get('/simplemine', function(req, res, next) {
    if (!req.user) {
        return res.json({
            info: "请登录",
            result: 2
        });
    }

    var user = req.user;

    // 查询耗时测试
    var start = new Date().getTime();

    Tag.find({
        _id: {
            $in: user.follow_tags
        }
    }, "_id key date")
        .lean()
        .sort('-date')
        .exec(function(err, tags) {
            if (err || !tags) {
                var unKonwErr = new Error('未知错误。')
                return next(err || unKonwErr);
            }

            res.json({
                info: 'success!',
                data: {
                    tags: tags
                },
                result: 0
            });
            var end = new Date().getTime(),
                spend = end - start;
            if (spend > common.maxtime) {
                console.log(req.originalUrl + ' spend' + spend + 'ms');
            }
        });
});

// 获取所有我的订阅
router.get('/mine', function(req, res, next) {
    req.session.redirectTo = '/tag';

    if (!req.user) {
        return res.redirect('/signin');
    }

    var user = req.user,
        uid = req.user._id;

    var populate = [{
        path: '_create_u',
        select: '_id username',
        option: { lean: true }
    }];
    
    populate.push({
        path: 'followers',
        match: { _id: uid },
        select: '_id',
        option: { lean: true },
        model: Account
    });

    // 查询耗时测试
    var start = new Date().getTime();

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
            _create_u : 1,
            followers : 1,
            unum      : { $size: '$followers' },
            dnum      : { $size: '$dreams' },
            date      : 1,
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
        $sort: { hot: -1 }
    }, {
        $limit: 11
    }], function(err, tags) {
        if (err) {
            return next(err);
        }

        Account.populate(tags, populate, function(err, tags) {
            if (err) {
                return next(err);
            }

            res.render('pages/tags', common.makeCommon({
                title: settings.APP_NAME,
                notice: common.getFlash(req, 'notice'),
                user : req.user,
                data: {
                    tags: tags,
                    tab  : 'mine'
                },
                success: 1
            }, res));

            var end = new Date().getTime(),
                spend = end - start;
            if (spend > common.maxtime) {
                console.log(req.originalUrl + ' spend' + spend + 'ms');
            }
        });
    });
});

// 获取所有最热订阅
router.get('/hot', function(req, res, next) {
    req.session.redirectTo = req.originalUrl;

    var populate = [{
        path: '_create_u',
        select: '_id username',
        option: { lean: true }
    }];

    if (req.user) {
        var uid = req.user._id;
        populate.push({
            path: 'followers',
            match: { _id: uid },
            select: '_id',
            option: { lean: true },
            model: Account
        });
    }

    // 查询耗时测试
    var start = new Date().getTime();

    Tag.aggregate([{
        $project: {
            _id       : 1,
            key       : 1,
            _create_u : 1,
            followers : 1,
            unum      : { $size: '$followers' },
            dnum      : { $size: '$dreams' },
            date      : 1,
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
        $sort: { hot: -1 }
    }, {
        $limit: 11
    }], function(err, tags) {
        if (err) {
            return next(err);
        }

        Account.populate(tags, populate, function(err, tags) {
            if (err) {
                return next(err);
            }

            res.render('pages/tags', common.makeCommon({
                title: settings.APP_NAME,
                notice: common.getFlash(req, 'notice'),
                user : req.user,
                data: {
                    tags: tags,
                    tab  : 'hot'
                },
                success: 1
            }, res));

            var end = new Date().getTime(),
                spend = end - start;
            if (spend > common.maxtime) {
                console.log(req.originalUrl + ' spend' + spend + 'ms');
            }
        });
    });
});

// 获取所有最新订阅
router.get('/newest', function(req, res, next) {
    req.session.redirectTo = req.originalUrl;

    var populate = [{
        path: '_create_u',
        select: '_id username',
        option: { lean: true }
    }];

    if (req.user) {
        var uid = req.user._id;
        populate.push({
            path: 'followers',
            match: { _id: uid },
            select: '_id',
            option: { lean: true },
            model: Account
        });
    }

    // 查询耗时测试
    var start = new Date().getTime();

    Tag.aggregate([{
        $project: {
            _id       : 1,
            key       : 1,
            _create_u : 1,
            followers : 1,
            unum      : { $size: '$followers' },
            dnum      : { $size: '$dreams' },
            date      : 1
        }
    }, {
        $sort: { date: -1 }
    }, {
        $limit: 11
    }], function(err, tags) {
        if (err) {
            return next(err);
        }

        Account.populate(tags, populate, function(err, tags) {
            if (err) {
                return next(err);
            }

            res.render('pages/tags', common.makeCommon({
                title: settings.APP_NAME,
                notice: common.getFlash(req, 'notice'),
                user : req.user,
                data: {
                    tags: tags,
                    tab  : 'new'
                },
                success: 1
            }, res));

            var end = new Date().getTime(),
                spend = end - start;
            if (spend > common.maxtime) {
                console.log(req.originalUrl + ' spend' + spend + 'ms');
            }
        });
    });
});

router.get('/:id([a-z0-9]+)', function(req, res, next) {
    req.session.redirectTo = req.originalUrl;

    var curId  = req.params.id,
        _curId = mongoose.Types.ObjectId(curId);

    var user = req.user, 
        uid = null;

    if (user) {
        uid = user._id;
    }

    // 确定显示规则逻辑
    var role    = 1,
        page    = 1,
        order   = -1,
        limit   = 10,
        project = {
            _id       : 1,
            content   : 1,
            text      : 1,
            nodes     : 1,
            cnum      : { $size: '$comments' },
            _belong_u : 1,
            date      : 1,
            isremove  : 1,
            vote: { 
                "$subtract": [ 
                    { "$size": "$good" },
                    { "$size": "$bad" }
                ]
            }
        };

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
                    _belong_t: _curId
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
                if (err) return cb(err, []);

                Account.populate(dreams, [{ 
                    path: '_belong_u',
                    select: '_id username avatar_mini',
                    option: { lean: true },
                    model: Account
                }], function(err, dreams) {
                    if (err) {
                        return next(err, []);
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

                        cb(null, dreams);
                    });
                });
            });
        },
        function(cb) {
            var _perm_id = mongoose.Types.ObjectId(settings.PERMS.DREAM_REMOVE);

            var populate = [{
                path   : "_create_u",
                select : "_id username",
                option: { lean: true }
            }];

            if (uid) {
                populate.push({ 
                    path: 'followers',
                    match: { _id: uid },
                    select: '_id',
                    option: { lean: true },
                    model: Account
                });
                populate.push({ 
                    path: 'permissions',
                    match: { _id: _perm_id },
                    select: '_id',
                    option: { lean: true },
                    model: Permission
                });
            }

            Tag.findById(_curId)
                .select("_id key description _create_u followers permissions president date")
                .lean()
                .populate(populate)
                .exec(function(err, tag) {
                    if (err || !tag) {
                        var unKonwErr = new Error('未知错误。')
                        return cb(err || unKonwErr, []);
                    }

                    cb(null, tag);
            });
        }], function(err, results) {
            if (err && results.length < 2) {
                return next(err, req, res, next);
            }

            var dreams    = results[0],
                tag       = results[1];

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
                next = page + 1;

            var delperm = (tag.president &&
                    tag.president.equals(uid) &&
                    tag.permissions &&
                    tag.permissions.length > 0);

            tag.delperm = delperm;

            res.render('pages/tag', common.makeCommon({
                user: req.user,
                title: settings.APP_NAME,
                notice: common.getFlash(req, 'notice'),
                data: {
                    tag        : tag,
                    dreams     : dreams,
                    hasprev : hasprev,
                    hasmore : hasmore,
                    role    : role,
                    order   : order,
                    prev    : prev,
                    next    : next,
                    nav     : 'dream',
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
});

router.get('/:id([a-z0-9]+)/role', function(req, res, next) {
    req.session.redirectTo = req.originalUrl;

    var curId  = req.params.id,
        _curId = mongoose.Types.ObjectId(curId);

    var user = req.user, 
        uid = null;

    if (user) {
        uid = user._id;
    }

    var populate = [{
        path   : "_create_u",
        select : "_id username",
        option: { lean: true }
    }];

    if (uid) {
        populate.push({ 
            path: 'followers',
            match: { _id: uid },
            select: '_id',
            option: { lean: true },
            model: Account
        });
    }

    Tag.findById(_curId)
        .select("_id key description _create_u followers date")
        .lean()
        .populate(populate)
        .exec(function(err, tag) {
            if (err || !tag) {
                var unKonwErr = new Error('未知错误。')
                return cb(err || unKonwErr, []);
            }

            res.render('pages/tag', common.makeCommon({
                user: req.user,
                title: settings.APP_NAME,
                notice: common.getFlash(req, 'notice'),
                data: {
                    tag     : tag,
                    roles   : [],
                    nav     : 'role',
                    domain  : req.get('origin') || req.get('host')
                },
                success: 1
            }, res));
        });
});

router.post('/subscribe', function(req, res, next) {
    var user = req.user;

    if (!user) {
        return res.json({
            info: "请登录",
            result: 2
        });
    }

    var uid = user._id

    if (!req.body) {
        return next(new Error("请求参数错误..."));
    }

    var tid = req.body.tid;

    if (!tid) {
        return next(new Error("参数传递错误，版面订阅失败..."));
    }

    tid = mongoose.Types.ObjectId(tid);

    Tag.subscribe({ 
        tid :  tid,
        uid :  uid
    }, function(err, ret) {
        if (err) return next(err);

        res.json({
            info: "版面订阅成功",
            result: 0
        });
    });
});

router.post('/csubscribe', function(req, res, next) {
    var user = req.user;

    if (!user) {
        return res.json({
            info: "请登录",
            result: 2
        });
    }

    var uid = user._id

    if (!req.body) {
        return next(new Error("请求参数错误..."));
    }

    var tid = req.body.tid;

    if (!tid) {
        return next(new Error("参数传递错误，取消版面订阅失败..."));
    }

    tid = mongoose.Types.ObjectId(tid);

    Tag.csubscribe({ 
        tid :  tid,
        uid :  uid
    }, function(err, ret) {
        if (err) return next(err);

        res.json({
            info: "取消版面订阅成功",
            result: 0
        });
    });
});

// 查看版面是否存在
router.post('/check', function(req, res, next) {
    if (!req.user) {
        return res.json({
            info: "请登录",
            result: 2
        });
    }

    var user = req.user,
        uid  = user._id;

    Tag.count({ _create_u: uid }, function(err, num) {
        if (err) return res.json({
            info: err.message,
            result: 1
        });

        if (num >= 3) {
            return res.json({
                info: settings.TAG_MORE_ERR,
                result: 1
            });
        }

        Tag.validation(req, function(err, formData) {
            if (err) return res.json({
                info: err.message,
                result: 1
            });

            Tag.findOne({ 
                key: formData.key
            })
                .select('_id')
                .lean()
                .exec(function(err, doc) {
                    if (err) return next(err);

                    if (doc) {
                        return res.json({
                            info: settings.TAG_EXIST_ERR,
                            result: 1
                        });
                    }

                    res.json({
                        info: "ok",
                        result: 0
                    });
                });
        });
    });
})

module.exports = router;
