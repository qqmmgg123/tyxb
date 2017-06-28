var async = require("async")
    , common = require('../common')
    , mongoose = require('mongoose')
    , settings = require("../const/settings")
    , errors = require('../models/errors')
    , Account = require('../models/account')
    , Dream = require('../models/dream')
    , Comment = require('../models/comment')
    , Tag = require('../models/tag')
    , router = require('express').Router();

// 用户贴文
router.get('/:id([a-z0-9]+)', function(req, res, next) {
    req.session.redirectTo = req.originalUrl;

    var curId = req.params.id,
        _curId = mongoose.Types.ObjectId(curId);

    var uid = null;
    if (req.user && req.user._id) uid = req.user._id;

    // 查询耗时测试
    var start = new Date().getTime(),
        aproject = {
            avatar   : 1,
            username : 1,
            bio      : 1,
            date     : 1,
            dnum     : { $size: '$dreams' },
            cnum     : { $size: '$comments' }
        };

    if (uid) {
        aproject.fnum = { $size: '$favourites' };
    }

    Account.aggregate([{
        $match: {
            "_id": _curId
        }
    }, {
        $project: aproject
    }], function(err, accounts) {
        var unexisterr = new Error(settings.USER_NOT_EXIST_TIPS);

        if (err || !accounts) {
            return next(err || unexisterr);
        };

        var account = accounts[0];

        if (!account) {
            return next(unexisterr);
        }else{
            var resRender = function(data) {
                res.render('pages/user', common.makeCommon({
                    title: settings.APP_NAME,
                    notice: common.getFlash(req, 'notice'),
                    user : req.user,
                    data: data,
                    success: 1
                }, res));

                var end = new Date().getTime();
                if (spend > common.maxtime) {
                    var spend = end - start;
                    console.log(req.originalUrl + ' spend' + spend + 'ms');
                }
            }

            var role    = 1,
                page    = 1,
                order   = -1,
                limit   = 10,
                project = {
                    _id       : 1,
                    content   : 1,
                    summary   : 1,
                    link      : 1,
                    category  : 1,
                    thumbnail : 1,
                    mthumbnail: 1,
                    cnum      : { $size: '$comments' },
                    _belong_u : 1,
                    _belong_t : 1,
                    date      : 1,
                    vote: { 
                        "$subtract": [ 
                            { "$size": "$good" },
                            { "$size": "$bad" }
                        ]
                    },
                    isremove: 1
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

            var resData = {
                account : account,
                dreams  : [],
                hasprev : false,
                hasmore : false,
                role    : role,
                order   : order,
                dnum    : account.dnum,
                cnum    : account.cnum,
                tab     : "dream",
                nav     : "user",
                domain  : req.get('origin') || req.get('host')
            };

            Dream.aggregate([{
                $match: {
                    "_belong_u": account._id
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
                    return resRender(resData);
                }

                Account.populate(dreams, [{ 
                    path: '_belong_u',
                    select: '_id username avatar bio',
                    option: { lean: true },
                    model: Account
                }], function(err, dreams) {
                    if (err) {
                        return resRender(resData);
                    }

                    Tag.populate(dreams, { 
                        path: '_belong_t',
                        select: "_id key",
                        option: { lean: true },
                        model: Tag
                    }, function(err, dreams) {
                        if (err) {
                            return resRender(resData);
                        }

                        if (dreams.length > 0) {
                            if (page > 1) {
                                resData.hasprev = true;
                            }
                            if (dreams[10]) {
                                resData.hasmore = true;
                            }
                            dreams = dreams.slice(0, 10);
                        }

                        resData.dreams = dreams;
                        resData.prev   = Math.max(page - 1, 1);
                        resData.next   = page + 1;

                        resRender(resData);
                    });
                });
            });
        }
    });
});

// 我的收藏
router.get('/:id([a-z0-9]+)/favourite', function(req, res, next) {
    req.session.redirectTo = req.originalUrl;

    var curId = req.params.id,
        _curId = mongoose.Types.ObjectId(curId);

    var uid = null;
    if (req.user && req.user._id) uid = req.user._id;

    // 查询耗时测试
    var start = new Date().getTime(),
        aproject = {
            avatar   : 1,
            username : 1,
            bio      : 1,
            date     : 1,
            dnum     : { $size: '$dreams' },
            cnum     : { $size: '$comments' }
        };

    if (uid) {
        aproject.fnum = { $size: '$favourites' };
    }

    Account.aggregate([{
        $match: {
            "_id": _curId
        }
    }, {
        $project: aproject
    }], function(err, accounts) {
        var unexisterr = new Error(settings.USER_NOT_EXIST_TIPS);

        if (err || !accounts) {
            return next(err || unexisterr);
        };

        var account = accounts[0];

        if (!account) {
            return next(unexisterr);
        }else{
            var resRender = function(data) {
                res.render('pages/user', common.makeCommon({
                    title: settings.APP_NAME,
                    notice: common.getFlash(req, 'notice'),
                    user : req.user,
                    data: data,
                    success: 1
                }, res));

                var end = new Date().getTime();
                if (spend > common.maxtime) {
                    var spend = end - start;
                    console.log(req.originalUrl + ' spend' + spend + 'ms');
                }
            }

            var role    = 1,
                page    = 1,
                order   = -1,
                limit   = 10,
                project = {
                    _id       : 1,
                    content   : 1,
                    summary   : 1,
                    link      : 1,
                    category  : 1,
                    thumbnail : 1,
                    mthumbnail: 1,
                    nodes     : 1,
                    cnum      : { $size: '$comments' },
                    _belong_u : 1,
                    _belong_t : 1,
                    date      : 1,
                    vote: { 
                        "$subtract": [ 
                            { "$size": "$good" },
                            { "$size": "$bad" }
                        ]
                    },
                    isremove: 1
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

            var resData = {
                account : account,
                dreams  : [],
                hasprev : false,
                hasmore : false,
                dnum    : account.dnum,
                cnum    : account.cnum,
                role    : role,
                order   : order,
                tab     : "favourite",
                nav     : "user",
                domain  : req.get('origin') || req.get('host')
            };

            Dream.aggregate([{
                $match: {
                    "_followers_u": account._id
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
                    return resRender(resData);
                }

                Account.populate(dreams, [{ 
                    path: '_belong_u',
                    select: '_id username avatar bio',
                    option: { lean: true },
                    model: Account
                }], function(err, dreams) {
                    if (err) {
                        return resRender(resData);
                    }

                    Tag.populate(dreams, { 
                        path: '_belong_t',
                        select: "_id key",
                        option: { lean: true },
                        model: Tag
                    }, function(err, dreams) {
                        if (err) {
                            return resRender(resData);
                        }

                        if (dreams.length > 0) {
                            if (page > 1) {
                                resData.hasprev = true;
                            }
                            if (dreams[10]) {
                                resData.hasmore = true;
                            }
                            dreams = dreams.slice(0, 10);
                        }

                        resData.dreams = dreams;
                        resData.prev   = Math.max(page - 1, 1);
                        resData.next   = page + 1;

                        resRender(resData);
                    });
                });
            });
        }
    });
});

// 我的留言
router.get('/:id([a-z0-9]+)/comment', function(req, res, next) {
    req.session.redirectTo = req.originalUrl;

    var curId = req.params.id;

    var uid = null;
    if (req.user && req.user._id) uid = req.user._id;

    // 查询耗时测试
    var start = new Date().getTime();

    Account.findOne({_id: curId})
    .lean()
    .select('avatar username bio date')
    .exec(function(err, account) {
        var unexisterr = new Error(settings.USER_NOT_EXIST_TIPS);
        if (err) {
            return next(unexisterr);
        };

        if (!account) {
            return next(unexisterr);
        }else{
            var handles = [
                function(cb) {
                    var role    = 1,
                        page    = 1,
                        order   = -1,
                        limit   = 10,
                        project = {
                            _id       : 1,
                            content   : 1,
                            _belong_u : 1,
                            _belong_d : 1,
                            _reply_c  : 1,
                            date      : 1,
                            vote: { 
                                "$subtract": [ 
                                    { "$size": "$good" },
                                    { "$size": "$bad" }
                                ]
                            },
                            isremove: 1
                        };

                    if (uid) {
                        project.isowner = { $eq: [ '$_belong_u', uid ] };
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

                    Comment.aggregate([{
                        $match: {
                            _belong_u: account._id
                        }
                    }, {
                        $project: project
                    }, {
                        $sort: sort
                    }, {
                        $limit: limit + 1
                    }], function(err, comments) {
                        if (err) {
                            return cb(err, []);
                        }

                        Account.populate(comments, [{ 
                            path: '_belong_u',
                            select: '_id username avatar_mini',
                            option: { lean: true },
                            model: Account
                        }], function(err, comments) {
                            if (err) {
                                return cb(err, []);
                            }

                            cb(null, comments);
                        });
                    });
                },
                function(cb) {
                    Dream.count({
                        _belong_u: curId
                    }, function(err, count) {
                        if (err || !count) {
                            return cb(null, 0);
                        }
        
                        cb(null, count)
                    });
                },
                function(cb) {
                    Comment.count({
                        _belong_u: curId
                    }, function(err, count) {
                        if (err || !count) {
                            return cb(null, 0);
                        }
        
                        cb(null, count)
                    });
                }];

            if (uid) {
                handles.push(function(cb) {
                    Dream.count({
                        _followers_u: uid
                    }, function(err, count) {
                        if (err || !count) {
                            return cb(null, 0);
                        }
        
                        cb(null, count)
                    });
                });
            }

            async.parallel(handles, function(err, results) {
                var hnum = uid? 4:3;

                if (err || !results || results.length !== hnum) {
                    return next(err || new Error("异常错误。"))
                }
        
                var comments  = results[0],
                    dnum      = results[1],
                    cnum      = results[2],
                    fnum      = 0;

                if (uid) {
                    fnum     = results[3]
                }

                var resRender = function(data) {
                    res.render('pages/user', common.makeCommon({
                        title: settings.APP_NAME,
                        notice: common.getFlash(req, 'notice'),
                        user : req.user,
                        data: data,
                        success: 1
                    }, res));
    
                    var end = new Date().getTime();
                    if (spend > common.maxtime) {
                        var spend = end - start;
                        console.log(req.originalUrl + ' spend' + spend + 'ms');
                    }
                }

                var resData = {
                    account   : account,
                    comments  : comments,
                    dnum      : dnum,
                    cnum      : cnum,
                    fnum      : fnum,
                    tab       : "comment",
                    nav       : "user"
                };

                resRender(resData);
            });
        }
    });
});

// 获取所有我的订阅
router.get('/:id([a-z0-9]+)/subscribe', function(req, res, next) {
    req.session.redirectTo = req.originalUrl;

    var curId = req.params.id,
        _curId = mongoose.Types.ObjectId(curId);

    var uid = null;
    if (req.user && req.user._id) {
        uid = req.user._id;
    }

    // 查询耗时测试
    var start = new Date().getTime(),
        aproject = {
            avatar   : 1,
            username : 1,
            bio      : 1,
            date     : 1,
            main_tag : 1,
            follow_tags: 1,
            dnum     : { $size: '$dreams' },
            cnum     : { $size: '$comments' }
        };

    if (uid) {
        aproject.fnum = { $size: '$favourites' };
    }

    Account.aggregate([{
        $match: {
            "_id": _curId
        }
    }, {
        $project: aproject
    }], function(err, accounts) {
        var unexisterr = new Error(settings.USER_NOT_EXIST_TIPS);

        if (err || !accounts) {
            return next(err || unexisterr);
        };

        var account = accounts[0];

        if (!account) {
            return next(unexisterr);
        }else{
            var populate = [{
                path: '_create_u',
                select: '_id username',
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

            Tag.aggregate([{
                $match: {
                    _id: {
                        $in: account.follow_tags
                    }
                }
            }, {
                $project: {
                    _id       : 1,
                    key       : 1,
                    _create_u : 1,
                    followers : 1,
                    isdisable : { $eq  : ["$president", account._id] },
                    unum      : { $size: '$followers' },
                    dnum      : { $size: '$dreams' },
                    ismain    : { $eq  : ["$_id", account.main_tag] },
                    date      : 1
                }
            }, {
                $sort: { ismain: -1, unum: -1, dnum: -1 }
            }, {
                $limit: 11
            }], function(err, tags) {
                if (err) {
                    return next(err);
                }

                res.render('pages/user', common.makeCommon({
                    title: settings.APP_NAME,
                    notice: common.getFlash(req, 'notice'),
                    user : req.user,
                    data: {
                        account   : account,
                        tags      : tags,
                        dnum      : account.dnum,
                        cnum      : account.cnum,
                        fnum      : account.fnum,
                        tab       : "subscribe",
                        nav       : "user"
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
    });
});

// 关注的人
router.get('/user/:id([a-z0-9]+)/following', function(req, res, next) {
    var curId   = req.params.id;
    
    var isMe    = false;

    var fields = {
        'fans': curId
    };

    var populate = [];

    if (req.user) {
        isMe    = curId === req.user.id;
        populate = {
           path  : 'fans',
           match : { _id: req.user.id},
           select: "_id",
           model : Account
        };
    }

    // 查询耗时测试
    var start = new Date().getTime();

    Account.find(fields)
    .lean()
    .select('_id username avatar_mini fans')
    .sort('-date')
    .populate(populate)
    .exec(function(err, following) {
        if (err || !following) {
            var unKnowErr = new Error('未知错误。');
            return next(err || unKnowErr);
        }

        res.render('pages/following', common.makeCommon({
            title: settings.APP_NAME,
            notice: common.getFlash(req, 'notice'),
            user : req.user,
            data: {
                following: following,
                isme: isMe
            },
            result: 0
        }, res));

        var spend = end - start;
        if (spend > common.maxtime) {
            var end = new Date().getTime();
            console.log(req.originalUrl + ' spend' + spend + 'ms');
        }

    });
});

// 粉丝页
router.get('/user/:id([a-z0-9]+)/follower', function(req, res, next) {
    var curId   = req.params.id;

    var isMe    = false;

    var fields = {
        'follows': curId
    };

    var populate = [];

    if (req.user) {
        isMe    = curId === req.user.id;

        populate = {
           path  : 'fans',
           match : { _id: req.user.id},
           select: "_id",
           model : Account
        };
    }

    // 查询耗时测试
    var start = new Date().getTime();

    Account.find(fields)
    .lean()
    .select('_id avatar_mini username fans')
    .sort('-date')
    .populate(populate)
    .exec(function(err, followers) {
        if (err || !followers) {
            var unKnowErr = new Error('未知错误。');
            return next(err || unKnowErr);
        }

        res.render('pages/follower', common.makeCommon({
            title: settings.APP_NAME,
            notice: common.getFlash(req, 'notice'),
            user : req.user,
            data: {
                followers: followers,
                isme: isMe
            },
            result: 0
        }, res));

        var end = new Date().getTime();
        if (spend > common.maxtime) {
            var spend = end - start;
            console.log(req.originalUrl + ' spend' + spend + 'ms');
        }

    });
});

// 更改用户资料
router.post('/update', function(req, res, next) {
    if (!req.user) {
        return res.json({
            info: "请登录",
            result: 2
        });
    }

    var uid = req.user.id;

    if (!req.body) {
        var err = new Error(settings.PARAMS_PASSED_ERR_TIPS);
        return next(err);
    }
    let { bio = '' } = req.body;

    req.user.update({
        bio      : bio.trim()
    }, function(err, course) {
        if (err) {
            return next(err);
        }

        res.json({
            info: "更新成功",
            result: 0
        });
    });
});

router.post('/user/cfollow', function(req, res, next) {
    if (!req.user) {
        return res.json({
            info: "请登录",
            result: 2
        });
    }

    var uid = req.user.id;

    if (!req.body.fid) {
        var err = new Error("取消关注失败");
        return next(err);
    }

    var followId = req.body.fid;

    if (uid === followId) {
        var err = new Error("不能取消关注自己");
    }

    var isfollow, isfans;
    async.parallel([
        function(cb) {
            Account.findById(uid, function(err, user) {
                if (err) return cb(err, null);

                if (!user) {
                    var err = new Error("取消关注失败");
                    return cb(err, null);
                }

                isfollow = user.follows.filter(function (follow) {
                    return follow.equals(followId);
                }).pop();

                cb(null, user);
            });
        },
        function(cb) {
            Account.findById(followId, function(err, user) {
                if (err) return cb(err, null);

                if (!user) {
                    var err = new Error("取消关注失败");
                    return cb(err, null);
                }
                
                isfans = user.fans.filter(function (fans) {
                    return fans.equals(uid);
                }).pop();

                cb(null, user);
            });
        }], function(err, results) {
            if (err) return next(err);

            if (!results || results.length < 2) {
                var err = new Error("取消关注失败");
                return next(err);
            }

            var fans = results[0];
            var follow = results[1];

            if (!isfollow && !isfans) {
                return next(new Error("你没有关注对方..."));
            }

            fans.follows.remove(follow);
            follow.fans.remove(fans);

            async.parallel([
                function(cb_2) {
                    fans.save(function(err) {
                        if (err) return cb_2(err, null);
                        cb_2(null, null);
                    });
                },
                function(cb_2) {
                    follow.save(function(err) {
                        if (err) return cb_2(err, null);
                        cb_2(null, null);
                    });
                }
                ], function(err, results) {
                    if (err) return next(err);

                    return res.json({
                        info: "取消关注成功",
                        result: 0
                    });
                }
            );
        }
    );
});

router.post('/user/follow', function(req, res, next) {
    if (!req.user) {
        return res.json({
            info: "请登录",
            result: 2
        });
    }

    var uid = req.user.id;

    if (!req.body.fid) {
        var err = new Error("关注失败");
        return next(err);
    }

    var followId = req.body.fid;

    if (uid === followId) {
        var err = new Error("不能关注自己");
        return next(err);
    }

    var isfollow, isfans;

    async.parallel([
        function(cb) {
            Account.findById(uid, function(err, user) {
                if (err) return cb(err, null);

                if (!user) {
                    var err = new Error("关注失败...");
                    return cb(err, null);
                }
                
                isfollow = user.follows.filter(function (follow) {
                    return follow.equals(followId);
                }).pop();

                cb(null, user);
            });
        },
        function(cb) {
            Account.findById(followId, function(err, user) {
                if (err) return cb(err, null);

                if (!user) {
                    var err = new Error("关注失败...");
                    return cb(err, null);
                }

                isfans = user.fans.filter(function (fans) {
                    return fans.equals(uid);
                }).pop();
                

                cb(null, user);
            });
        }], function(err, results) {
            if (err) return next(err);

            if (!results || results.length < 2) {
                var err = new Error("关注失败...");
                return next(err);
            }

            var fans = results[0];
            var follow = results[1];

            if (isfollow || isfans) {
                if (isfollow && isfans) {
                    return next(new Error("你已经关注了对方..."));
                }
            }
            fans.follows.push(follow);
            follow.fans.push(fans);

            async.parallel([
                function(cb_2) {
                    fans.save(function(err) {
                        if (err) {
                            return cb_2(err, null);
                        }
                        cb_2(null, null);
                    });
                },
                function(cb_2) {
                    follow.save(function(err) {
                        if (err) {
                            return cb_2(err, null);
                        }
                        cb_2(null, null);
                    });
                }
                ], function(err, results) {
                    if (err) {
                        return next(err);
                    }

                    return res.json({
                        info: "关注成功",
                        result: 0
                    });
            });
        }
    );
});

module.exports = router;
