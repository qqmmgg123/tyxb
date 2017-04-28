var common = require('../common')
    , settings  = require('../const/settings')
    , mongoose = require('mongoose')
    , Account  = require('../models/account')
    , Dream = require("../models/dream")
    , Comment = require("../models/comment")
    , Message = require("../models/message")
    , log = require('util').log
    , router = require('express').Router();

// 创建回复
router.post('/new', function(req, res, next) {
    if (!req.user) {
        return res.json({
            info: "请登录",
            result: 2
        });
    }

    var uid = req.user._id,
        params   = req.body;

    if (!params || !params.reply || !params.rid) {
        return next(new Error("请求参数错误，创建失败..."));
    }

    var reply   = parseInt(params.reply, 10),
        rid     = params.rid,
        content = params.content;

    if (typeof content !== "string" || !content.trim()) {
        return next(new Error("您的" + 
            settings.COMMENT_TEXT.EXPANSION_COMMENT + 
                "是空内容，创建失败..."));
    }

    // 查询耗时测试
    var start = new Date().getTime();

    switch(reply) {
        case settings.OBJEXT_TYPE.DREAM:
            category = "dream";
            cname    = "贴文";
            rname    = "留言";
            Model = Dream;
            break;
        case settings.OBJEXT_TYPE.COMMENT:
            category = "comment";
            cname    = "留言";
            rname    = "回复";
            Model = Comment;
            break;
        default:
            return next(new Error("请求参数错误，创建失败..."));
            break;
    }

    Model.findById(rid)
        .select('_id _belong_u _belong_d')
        .exec(function(err, object) {
            if (err || !object) {
                var err = err || new Error("您回复的" + cname + "不存在。");
                return next(err);
            }

            var opts = {
                object  : object,
                uid     : uid,
                content : content,
                reply   : reply
            };

            Comment.create(opts, function(err, comment) {
                if (err) return next(err);

                // 绑定评论信息
                comment = comment.toObject();
                comment._belong_u = req.user;
                comment.vote = 0;

                var data = {};
                data.info   =  "发布成功";
                data.result = 0;
                data.user = req.user;
                data.comment = comment;
                data.text = settings.COMMENT_TEXT;
                res.json(data);

                var end = new Date().getTime(),
                    spend = end - start;
                if (spend > common.maxtime) {
                    console.log(req.originalUrl + ' spend' + spend + 'ms');
                }
            });
        });
});

// 删除回复
router.post('/delete', function(req, res, next) {
    if (!req.user) {
        return res.json({
            info: "请登录",
            result: 2
        });
    }

    var uid = req.user.id;

    if (!req.body || !req.body.cid) {
        return next(new Error("请求参数错误..."));
    }

    var commentID = req.body.cid;

    // 查询耗时测试
    var start = new Date().getTime();

    var cname = settings.COMMENT_TEXT.EXPANSION_COMMENT;

    Comment.findById( 
        commentID, 
        '_belong_u _belong_d _reply_c _reply_d isremove',
        function(err, comment) {
            if (err) return next(err);

            if (!comment || comment.isremove) {
                var err = new Error("您要删除的" + cname + "已经被删除...");
                return next(err);
            }

            if (!comment._belong_u.equals(uid)) {
                var err = new Error("这不是您的" + cname + "，你不能删除...");
                return next(err);
            }

            var resData = function() {
                res.json({
                    info: "删除" + cname + "成功",
                    result: 0
                });

                var end = new Date().getTime();
                var spend = end - start;
                if (spend > common.maxtime) {
                    console.log(req.originalUrl + ' spend' + spend + 'ms');
                }
            };

            Comment.count({ _reply_c: commentID }, function(err, cnum) {
                if (err) return next(err);

                if (cnum > 0) {
                    comment.markRemove(function(err) {
                        if (err) {
                            return next(err);
                        }

                        Comment.update({ 
                            _id: commentID
                        }, { 
                            $set: { isremove: true }
                        }, function(err, res) {
                            if (err) {
                                return next(err);
                            }

                            resData();
                        });
                    });
                } else {
                    comment.remove(function(err) {
                        if (err) {
                            return next(err);
                        }

                        resData();
                    });
                }
            });
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

    if (!req.body || !req.body.cid) {
        return next(new Error("请求参数错误..."));
    }

    var cid = mongoose.Types.ObjectId(req.body.cid),
        uid = req.user._id;

    Comment.goodIt(cid, uid, function(err, num) {
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

    if (!req.body || !req.body.cid) {
        return next(new Error("请求参数错误..."));
    }

    var cid = mongoose.Types.ObjectId(req.body.cid),
        uid = req.user._id;

    Comment.badIt(cid, uid, function(err, num) {
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

    if (!req.body || !req.body.cid) {
        return next(new Error("请求参数错误..."));
    }

    var cid = mongoose.Types.ObjectId(req.body.cid),
        uid = req.user._id;

    Comment.cancelGood(cid, uid, function(err, num) {
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

    if (!req.body || !req.body.cid) {
        return next(new Error("请求参数错误..."));
    }

    var cid = mongoose.Types.ObjectId(req.body.cid),
        uid = req.user._id;

    Comment.cancelBad(cid, uid, function(err, num) {
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

// 获取单条回复讨论串
router.get('/:id([a-z0-9]+)', function(req, res, next) {
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
            _id: _curId
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
        }];

        if (qtimes !== 0) {
            opts.push({
                $sort: sort
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
                            hasprev = false,
                            hasmore = false;
                        if (comments && comments.length > 10) {
                            hasmore = true;
                        }
                        comments = comments.slice(0, 10);

                        if (comments && comments.length > 0) {
                            hasprev = !!comments[0]._reply_c;
                        }

                        var next = page + 1;

                        var resData = {
                            comments   : comments,
                            hasprev    : hasprev,
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
            _reply_c: _curId
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

module.exports = router;

