var async = require("async")
    , common = require('../common')
    , settings  = require('../const/settings')
    , Message = require("../models/message")
    , log = require('util').log
    , router = require('express').Router();


// 消息页
router.get('/', function(req, res) {
    if (!req.user) {
        return res.redirect('/signin');
    }

    var uid   = req.user.id,
        rdate = req.user.msgreviewdate;

    var fields = {
        '_belong_u': uid
    };

    var page  = 1,
        limit = 10;

    if (req.query && req.query.page) {
        page = parseInt(req.query.page);
    }

    var skip = (page - 1) * 10;

    // 查询耗时测试
    var start = new Date().getTime();


    async.parallel([
        function(cb) {
            Message.count(fields, function (err, count) {
                if (err || !count) {
                    return cb(null, 0);
                }
                
                cb(null, count);
            });
        },
        function(cb) {
            Message.find(fields)
            .lean()
            .sort('-date')
            .skip(skip)
            .limit(limit)
            .exec(function(err, msgs) {
                if (err || !msgs) {
                    var unKnowErr = new Error('未知错误。');
                    return cb(err || unKnowErr, []);
                }
                
                cb(null, msgs);
            });
        }], function(err, results) {
            if (err || !results || results.length !== 2) {
                return next(err);
            }
    
            var total = results[0],
                msgs  = results[1];

            var count = Math.ceil(total/limit);

            var pstart = 2,
                prand  = 3;

            if (count > prand && page > count - prand) {
                pstart = count - 3;
            }
                
            if (page > prand && page <= count - prand) {
                pstart = page - 1;
            }

            pstart = Math.max(2, pstart);

            var pend = pstart + prand;

            res.render('pages/message', common.makeCommon({
                title: settings.APP_NAME,
                notice: common.getFlash(req, 'notice'),
                user : req.user,
                data: {
                    msgs  : msgs,
                    page  : page,
                    count : count,
                    start : pstart,
                    end   : pend
                },
                result: 0
            }, res));

            var end = new Date().getTime(),
                spend = end - start;
            if (spend > common.maxtime) {
                console.log(req.originalUrl + ' spend' + spend + 'ms');
            }
 
        }
    );
});

// 获取消息信息
router.get('/boxshow', function(req, res, next) {
    if (!req.user) {
        return res.json({
            info: "请登录",
            result: 2
        });
    }

    var uid   = req.user.id,
        rdate = req.user.msgreviewdate;

    var fields = {
        '_belong_u': uid
    };
        
    Message.find(fields)
    .lean()
    .sort('-date')
    .limit(5)
    .exec(function(err, msgs) {
        if (err) {
            return next(err);
        }

        if (rdate) {
            req.user.update({
                msgreviewdate : new Date()
            }, function(err, course) {
                if (err) {
                    return next(err);
                }

                res.msgs = msgs;
                res.json({
                    info: "ok",
                    data: msgs,
                    result: 0
                });
            });
        } else {
            req.user.msgreviewdate = new Date();
            req.user.save(function(err) {
                if (err) {
                    return next(err);
                }

                res.msgs = msgs;
                res.json({
                    info: "ok",
                    data: msgs,
                    result: 0
                });
            })
        }
    });
});


// 移除消息
router.post('/remove', function(req, res, next) {
    if (!req.user) {
        return res.json({
            info: "请登录",
            result: 2
        });
    }

    var uid = req.user.id;

    if (!req.body || !req.body.mid) {
        return next(new Error("请求参数错误..."));
    }

    console.log(req.query.mid);

    var msgId = req.body.mid;

    Message.findById(msgId, function(err, msg) {
        if (err) return next(err);

        if (!msg) {
            var err = new Error("移除消息失败...");
            return next(err);
        }

        if (!msg._belong_u.equals(uid)) {
            var err = new Error("这不是你的消息，你不能移除...");
            return next(err);
        }

        msg.remove(function(err) {
            if (err) {
                var err = new Error("移除消息失败...");
                return next(err);
            }

            res.json({
                info: "移除消息成功",
                result: 0
            });
        });
    });
});

module.exports = router;

