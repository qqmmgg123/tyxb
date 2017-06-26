var async = require("async")
    , common = require('../common')
    , settings = require("../const/settings")
    , mongoose = require('mongoose')
    , Account = require('../models/account')
    , Dream = require("../models/dream")
    , Text     = require("../models/text")
    , Comment = require("../models/comment")
    , Tag     = require("../models/tag")
    , cheerio = require('cheerio')
    , charset = require("superagent-charset")
    , request = require('superagent')
    , log = require('util').log
    , router = require('express').Router();


// 抓取网站
router.get('/getsite', function(req, res, next) {
    const { link } = req.query;

    request.get(link)
        .charset('gbk')
        .end(function(err, pres){
            if (err) {
                return next(err);
            }

            let $   = cheerio.load(pres.text, {decodeEntities: false});
            let tEl = $('title');

            return res.json({
                info: 'success!',
                data: {
                    site: (tEl && tEl.html()) || ''
                },
                result: 0
            });
        })
});

// 创建一个想法
router.post('/new', function(req, res, next) {
    let user     = req.user;
    
    if (!user) {
        return res.json({
            info: "请登录",
            result: 2
        });
    }

    let uid = user._id;

    if (!req.body) {
        return next(new Error(settings.PARAMS_PASSED_ERR_TIPS));
    }

    let { tag, content, link, text, image, category } = req.body;
        
    if (!content || !content.trim() ||
        !category || !category.trim()) {
        return next(new Error("没有填写标题或参数错误!"));
    }

    // 插入耗时测试
    let start = new Date().getTime();

    let fields = {
        content    : content.trim(),
        _belong_u  : uid,
        category   : category.trim()
    }

    if (tag && tag.trim()) {
        fields._belong_t = tag;
    }

    var dream = new Dream(fields);

    var did      = dream._id;

    if ((category === "link" || category === 'news') &&  link && link.trim()) {
        dream.link = link;
        dream.site = common.extractHostname(link);
    }
    if ((category === "text" || category === 'news') && text && text.trim()) {
        dream.text = text;
        dream.extract();
    }
    if ((category === "image" || category === 'news') && image && image.trim()) {
        image = image.trim();
        if (category === "image") {
            dream.image = image.replace('/pic/', /uploads/);
            imageMagick()
        }
        else (category === "news") {
            dream.image = image;
        }
    }
    else{
        dream.save(function(err) {
            if (err) return next(err);

            return res.json({
                info: "发布成功",
                data: {
                    did: did
                },
                result: 0
            });

            let end = new Date().getTime(),
                spend = end - start;
            if (spend > common.maxtime) {
                console.log(req.originalUrl + ' spend' + spend + 'ms');
            }
        });
    }
});

// 想法详情页
router.get('/:id([a-z0-9]+)', function(req, res, next) {
    req.session.redirectTo = req.url;

    var curId  = req.params.id,
        _curId = mongoose.Types.ObjectId(curId);

    // 查询耗时测试
    var start = new Date().getTime(),
        user  = req.user;
    var dproject = {
        _id       : 1,
        content   : 1,
        text      : 1,
        link      : 1,
        site      : 1,
        image     : 1,
        vote      : { $subtract: [{ $size: '$good'}, { $size: '$bad' }]},
        cnum      : { $size: '$comments' },
        isremove  : 1,
        _belong_u : 1,
        _belong_t : 1,
        date      : 1
    };

    if (user) {
        var uid = user._id
        dproject.isowner = { $eq: [ '$_belong_u', uid ] };
        dproject.good = {
            $filter: {
                input: '$good',
                as   : 'uid',
                cond : { $eq: ['$$uid', uid] }
            }
        };
        dproject.bad = {
            $filter: {
                input: '$bad',
                as   : 'uid',
                cond : { $eq: ['$$uid', uid] }
            }
        };
        dproject._followers_u = {
            $filter: {
                input: '$_followers_u',
                as   : 'uid',
                cond : { $eq: ['$$uid', uid] }
            }
        };
    }

    Dream.aggregate([{
        $match: {
            _id: _curId
        }
    }, {
        $project: dproject
    }], function(err, dreams) {
        if (err) return next(err);

        // 确定回复显示规则逻辑
        var role    = 1,
            page    = 1,
            order   = -1,
            limit   = 10,
            focus   = 'dream',
            cid     = '',
            cproject = {
                _id       : 1,
                content   : 1,
                _belong_u : 1,
                _belong_d : 1,
                _reply_c  : 1,
                good      : 1,
                bad       : 1,
                comments  : { $slice: [ "$comments", limit ] },
                cnum      : { $size: '$comments' },
                hasmore   : { $gt: [ { $size: '$comments' }, limit ] },
                isremove  : 1,
                date      : 1,
                vote: { 
                    "$subtract": [ 
                        { "$size": "$good" },
                        { "$size": "$bad" }
                    ]
                }
            };

        if (focus === 'comment') {
            cproject.summary = 1;
        }

        if (user) {
            var uid = user._id
            cproject.isowner = { $eq: [ '$_belong_u', uid ] };
            cproject.good = {
                $filter: {
                    input: '$good',
                    as   : 'uid',
                    cond : { $eq: ['$$uid', uid] }
                }
            };
            cproject.bad = {
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
                cproject.hot = {
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

        var cmatch = {
            $match: {
                _reply_d: _curId
            }
        }, qtimes = 0;

        // 查看指定留言串
        if (req.query && req.query.cid) {
            cid  = req.query.cid.trim(),
                _cid = mongoose.Types.ObjectId(cid);

            cmatch.$match = {
                _id: _cid
            };

            focus = 'comment';
        }

        queryComment(cmatch, page);

        var allComments = [];

        function queryComment(match, page) {
            if (qtimes === 2) {
                cproject.hasmore = { $gt: [ { $size: '$comments' }, 0 ] };
            }

            var opts = [match, {
                $project: cproject
            }];

            if (focus !== 'comment') {
                opts.push({
                    $sort: sort
                });

                if (qtimes === 0) {
                    opts.push({
                        $skip: skip
                    }, {
                        $limit: limit + 1
                    });
                }
            }

            Comment.aggregate(opts, function(err, comments) {
                if (err) return next(err);

                Account.populate(comments, [{ 
                    path: '_belong_u',
                    select: '_id username avatar_mini',
                    option: { lean: true },
                    model: Account
                }],
                    function(err, comments) {
                        if (err) {
                            return next(err);
                        }

                        allComments.push(comments);

                        var cids = [];
                        comments.forEach(function(comment) {
                            var ccids = comment.comments;
                            if (ccids && ccids.length > 0) {
                                cids = cids.concat(ccids);
                            }
                        });

                        var match = {
                            $match: {
                                _id: {
                                    $in: cids
                                }
                            }
                        };
                        if (cids.length > 0 && qtimes < 2) {
                            qtimes++;
                            queryComment(match, 1);
                        }else{
                            var n = allComments.length;
                            
                            if (n > 1) {
                                for (var i = n - 1; i > 0; i--) {
                                    allComments[i].forEach(function(childNode) {
                                        allComments[i - 1].forEach(function(parentNode) {
                                            if (childNode._reply_c.equals(parentNode._id)) {
                                                if (!parentNode.replys) {
                                                    parentNode.replys = [];
                                                }
                                                parentNode.replys.push(childNode);
                                            }
                                        });
                                    });
                                    allComments.splice(i, 1);
                                }
                            }

                            // 
                            if (!dreams[0]) {
                                var noExistErr  = new Error(
                                    settings.DREAM_NOT_EXIST_TIPS
                                );
                                return next(noExistErr);
                            }

                            var populate = [{ 
                                path: '_belong_u',
                                select: '_id username avatar_mini',
                                option: { lean: true },
                                model: Account
                            }];

                            Account.populate(dreams, populate, 
                                function(err, dreams) {
                                    if (err) {
                                        return next(err);
                                    }

                                        Tag.populate(dreams, { 
                                            path: '_belong_t',
                                            select: "_id key description ispublic",
                                            option: { lean: true },
                                            model: Tag
                                        }, function(err, dreams) {
                                            if (err) {
                                                return next(err);
                                            }
                                            
                                            var comments = allComments[0],
                                                hasprev = false,
                                                hasmore = false;
                                            if (comments && comments.length > 10) {
                                                hasmore = true;
                                            }
                                            comments = comments.slice(0, 10);

                                            if (focus === 'comment') {
                                                if (comments && comments.length > 0) {
                                                    hasprev = !!comments[0]._reply_c;
                                                }
                                            }

                                            var next = page + 1;

                                            var dream = dreams[0],
                                                resData = {
                                                current    : dream,
                                                comments   : comments,
                                                hasprev    : hasprev,
                                                hasmore    : hasmore,
                                                role       : role,
                                                focus      : focus,
                                                cnext      : next,
                                                text       : settings.COMMENT_TEXT,
                                                isauthenticated: !!req.user,
                                                domain     : req.get('origin') || req.get('host')
                                            };

                                            if (focus === 'comment') {
                                                resData.cid = cid;
                                            }

                                            res.render('pages/dream', common.makeCommon({
                                                user  : req.user,
                                                title : settings.APP_NAME,
                                                notice: common.getFlash(req, 'notice'),
                                                data  : resData,
                                                success: 1
                                            }, res));

                                            var end = new Date().getTime(),
                                                spend = end - start;
                                            if (spend > common.maxtime) {
                                                console.log(req.originalUrl + ' spend' + spend + 'ms');
                                            }
                                        });
                                });
                        }
                    });
            });
        };
    });
});

// 获取回复
router.get('/:id([a-z0-9]+)/comments', function(req, res, next) {
    var curId  = req.params.id,
        _curId = mongoose.Types.ObjectId(curId);

    // 查询耗时测试
    var start = new Date().getTime(),
        user  = req.user;

    // 确定回复显示规则逻辑
    var role    = 1,
        page    = 1,
        order   = -1,
        limit   = 10,
        cproject = {
            _id       : 1,
            content   : 1,
            _belong_u : 1,
            _belong_d : 1,
            _reply_c  : 1,
            good      : 1,
            bad       : 1,
            comments  : { $slice: [ "$comments", limit ] },
            cnum      : { $size: '$comments' },
            hasmore   : { $gt: [ { $size: '$comments' }, limit ] },
            isremove  : 1,
            date      : 1,
            vote: { 
                "$subtract": [ 
                    { "$size": "$good" },
                    { "$size": "$bad" }
                ]
            }
        };

    if (user) {
        var uid = user._id
        cproject.isowner = { $eq: [ '$_belong_u', uid ] };
        cproject.good = {
            $filter: {
                input: '$good',
                as   : 'uid',
                cond : { $eq: ['$$uid', uid] }
            }
        };
        cproject.bad = {
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
            cproject.hot = {
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

    var cmatch = {
        $match: {
            _reply_d: _curId
        }
    }, qtimes = 0;

    queryComment(cmatch, page);

    var allComments = [];

    function queryComment(match, page) {
        if (qtimes === 2) {
            cproject.hasmore = { $gt: [ { $size: '$comments' }, 0 ] };
        }

        var opts = [match, {
            $project: cproject
        }, {
            $sort: sort
        }];

        if (qtimes === 0) {
            opts.push({
                $skip: skip
            }, {
                $limit: limit + 1
            });
        }

        Comment.aggregate(opts, function(err, comments) {
            if (err) return next(err);

            Account.populate(comments, [{ 
                path: '_belong_u',
                select: '_id username avatar_mini',
                option: { lean: true },
                model: Account
            }],
                function(err, comments) {
                    if (err) {
                        return next(err);
                    }

                    allComments.push(comments);

                    var cids = [];
                    comments.forEach(function(comment) {
                        var ccids = comment.comments;
                        if (ccids && ccids.length > 0) {
                            cids = cids.concat(ccids);
                        }
                    });

                    var match = {
                        $match: {
                            _id: {
                                $in: cids
                            }
                        }
                    };
                    if (cids.length > 0 && qtimes < 2) {
                        qtimes++;
                        queryComment(match, 1);
                    }else{
                        var n = allComments.length;

                        if (n > 1) {
                            for (var i = n - 1; i > 0; i--) {
                                allComments[i].forEach(function(childNode) {
                                    allComments[i - 1].forEach(function(parentNode) {
                                        if (childNode._reply_c.equals(parentNode._id)) {
                                            if (!parentNode.replys) {
                                                parentNode.replys = [];
                                            }
                                            parentNode.replys.push(childNode);
                                        }
                                    });
                                });
                                allComments.splice(i, 1);
                            }
                        }

                        if (err) {
                            return next(err);
                        }

                        var comments = allComments[0],
                            hasmore = false;
                        if (comments && comments.length > 10) {
                            hasmore = true;
                        }
                        comments = comments.slice(0, 10);
                        
                        var next = page + 1;

                        var resData = {
                            comments   : comments,
                            hasmore    : hasmore,
                            cnext      : next,
                            isauthenticated: !!user,
                            text       : settings.COMMENT_TEXT,
                            role       : role
                        };

                        return res.json({
                            info: 'success!',
                            data: resData,
                            user: user,
                            result: 0
                        });

                        var end = new Date().getTime(),
                            spend = end - start;
                        if (spend > common.maxtime) {
                            console.log(req.originalUrl + ' spend' + spend + 'ms');
                        }
                    }
                });
        });
    };
});

// 学派驳回
router.post('/reject', function(req, res, next) {
    if (!req.user) {
        return res.json({
            info: "请登录",
            result: 2
        });
    }

    var uid = req.user.id;

    if (!req.body || !req.body.did) {
        return next(new Error("请求参数错误..."));
    }

    var did = req.body.did;

    // 查询耗时测试
    var start = new Date().getTime();

    var dname = settings.OBJECT.DREAM.CNNAME;

    var resData = function(info) {
        res.json({
            info: info,
            result: 0
        });

        var end = new Date().getTime();
        var spend = end - start;
        if (spend > common.maxtime) {
            console.log(req.originalUrl + ' spend' + spend + 'ms');
        }
    };

    function hasPerm(perms, perm_id) {
        return (perms.filter(function(perm) {
            if (perm.equals(perm_id)) return true;
        }).length > 0);
    }

    Dream.findById(did)
        .select('_belong_u _belong_t')
        .populate({
            path: '_belong_t',
            select: 'president permissions'
        })
        .exec(function(err, dream) {
            if (err) return next(err);

            if (!dream || dream.isremove) {
                var err = new Error("您要驳回的" + dname + "已经不存在...");
                return next(err);
            }

            var tag = dream._belong_t;

            if (tag && 
                tag.president &&
                tag.president.equals(uid) &&
                tag.permissions &&
                hasPerm(tag.permissions, settings.PERMS.DREAM_REMOVE)) {
                    return dream.tagRemove(function(err) {
                        if (err) {
                            return next(err);
                        }

                        var opts = {
                            object  : dream,
                            uid     : uid,
                            content : settings.DREAM_PASS_ERROR,
                            reply   : settings.OBJEXT_TYPE.DREAM
                        };
                        Comment.create(opts, function(err, comment) {
                            if (err) return next(err);

                            resData("该言论已经被删除，删除邮件已经发送给该言论作者。");
                        });
                    });
                }
        });
});

// 删除想法
router.post('/delete', function(req, res, next) {
    if (!req.user) {
        return res.json({
            info: "请登录",
            result: 2
        });
    }

    var uid = req.user.id;

    if (!req.body || !req.body.did) {
        return next(new Error("请求参数错误..."));
    }

    var did = req.body.did;

    // 查询耗时测试
    var start = new Date().getTime();

    var dname = settings.OBJECT.DREAM.CNNAME;

    var resData = function() {
        res.json({
            info: "删除" + dname + "成功",
            result: 0
        });

        var end = new Date().getTime();
        var spend = end - start;
        if (spend > common.maxtime) {
            console.log(req.originalUrl + ' spend' + spend + 'ms');
        }
    };

    Dream.findById(did)
        .select('_belong_u _belong_t isremove')
        .exec(function(err, dream) {
            if (err) return next(err);

            if (!dream || dream.isremove) {
                var err = new Error("您要删除的" + dname + "已经被删除...");
                return next(err);
            }

            if (!dream._belong_u.equals(uid)) {
                var err = new Error("这不是您的" + dname + "，你不能删除...");
                next(err);
            } else {
                dream.userRemove(function(err) {
                    if (err) {
                        return next(err);
                    }

                    resData();
                });
            }
    });
});

// 点赞
router.post('/goodit', function(req, res, next) {
    if (!req.user) {
        return res.json({
            info: "请登录",
            result: 2
        });
    }

    if (!req.body || !req.body.did) {
        return next(new Error("请求参数错误..."));
    }

    var did = mongoose.Types.ObjectId(req.body.did),
        uid = req.user._id;

    Dream.goodIt(did, uid, function(err, num) {
        if (err) {
            return next(err.message);
        }

        return res.json({
            info: 'success!',
            data: {
                num: num
            },
            result: 0
        });
    });
});

// 反对
router.post('/badit', function(req, res, next) {
    if (!req.user) {
        return res.json({
            info: "请登录",
            result: 2
        });
    }

    if (!req.body || !req.body.did) {
        return next(new Error("请求参数错误..."));
    }

    var did = mongoose.Types.ObjectId(req.body.did),
        uid = req.user._id;

    Dream.badIt(did, uid, function(err, num) {
        if (err) {
            return next(err.message);
        }

        return res.json({
            info: 'success!',
            data: {
                num: num
            },
            result: 0
        });
    });
});

// 取消点赞
router.post('/cgood', function(req, res, next) {
    if (!req.user) {
        return res.json({
            info: "请登录",
            result: 2
        });
    }

    if (!req.body || !req.body.did) {
        return next(new Error("请求参数错误..."));
    }

    var did = mongoose.Types.ObjectId(req.body.did),
        uid = req.user._id;

    Dream.cancelGood(did, uid, function(err, num) {
        if (err) {
            return next(err.message);
        }

        return res.json({
            info: 'success!',
            data: {
                num: num
            },
            result: 0
        });
    });
});

// 取消反对
router.post('/cbad', function(req, res, next) {
    if (!req.user) {
        return res.json({
            info: "请登录",
            result: 2
        });
    }

    if (!req.body || !req.body.did) {
        return next(new Error("请求参数错误..."));
    }

    var did = mongoose.Types.ObjectId(req.body.did),
        uid = req.user._id;

    Dream.cancelBad(did, uid, function(err, num) {
        if (err) {
            return next(err.message);
        }

        return res.json({
            info: 'success!',
            data: {
                num: num
            },
            result: 0
        });
    });
});

// 取消收藏想法
router.post('/cfollowing', function(req, res, next) {
    if (!req.user) {
        return res.json({
            info: "请登录",
            result: 2
        });
    }

    var uid = req.user._id;

    if (!req.body || !req.body.did) {
        return next(new Error("请求参数错误..."));
    }

    var did = req.body.did;

    Dream.findById(did, function(err, dream) {
        if (err) return next(err);

        if (!dream) {
            var err = new Error("该想法不存在，您无法取消收藏");
            return next(err);
        }

        dream.cfollowing(uid, function() {
            if (err) {
                return next(err);
            }

            res.json({
                info: 'success!',
                data: {
                },
                result: 0
            });
        });
    });
});

// 收藏想法
router.post('/following', function(req, res, next) {
    if (!req.user) {
        return res.json({
            info: "请登录",
            result: 2
        });
    }

    var uid = req.user._id;
    
    if (!req.body.did) {
        return next(new Error("请求参数错误..."));
    }

    var did = req.body.did;

    Dream.findById(did, function(err, dream) {
        if (err) return next(err);

        if (!dream) {
            var err = new Error("该想法不存在，您无法收藏");
            return next(err);
        }

        dream.following(uid, function(err) {
            if (err) {
                return next(err);
            }

            res.json({
                info: 'success!',
                data: {
                },
                result: 0
            });
        });
    });
});

module.exports = router;
