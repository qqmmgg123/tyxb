var router = require('express').Router()
,   settings  = require('../const/settings')
,   async = require("async")
,   common  = require('../common')
,   Account  = require('../models/account')
,   Tag    = require('../models/tag')
,   Dream  = require('../models/dream')
,   log = require('util').log
,   Text  = require('../models/text');

// 搜索结果
router.get('/', function(req, res, next) {
    req.session.redirectTo = req.originalUrl;

    var reponse = function(type, query, data) {
        res.render('pages/search', common.makeCommon({
            title: settings.APP_NAME,
            notice: common.getFlash(req, 'notice'),
            user : req.user,
            data: {
                query: query,
                type: type,
                results: data
            },
            result: 0
        }, res));
    }

    if (!req.query) {
        return reponse('all', '', []);
    }

    var query = req.query.query,
        type  = req.query.type || 'all';

    if (typeof query !== "string") {
        return reponse(type, '', []);
    }

    query = common.quote(query.trim());

    if (!query) {
        return reponse(type, query, []);
    }

    var querys = query.split(' '),
        query  = querys.join('|'),
        reg    = new RegExp(query);

    var tagQuery = function(cb, limit) {
        var populate = [{
            path   : '_create_u',
            select : '_id username',
            option : { lean: true },
            domain : req.get('origin') || req.get('host')
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
            $match: {
                key: reg
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
            $limit: limit
        }], function(err, tags) {
            if (err) {
                return cb(err, []);
            }

            cb(null, tags);
        });
    }

    var dreamQuery = function(cb) {
        var role    = 1,
            page    = 1,
            order   = -1,
            limit   = 10,
            project = {
                _id       : 1,
                content   : 1,
                text      : 1,
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

        Dream.aggregate([{
                $match: {
                    content: reg
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
                                return cb(err, []);
                            }

                            cb(null, dreams);
                        });
                    });
                });
            });
    }

    switch(type) {
        case 'all':
            var handles = [function(cb) { tagQuery(cb, 5) }, dreamQuery];
            async.parallel(handles, function(err, results) {
                if (err && results.length < 2) {
                    return reponse(type, query, []);
                }

                var data = {};

                data.tags      = results[0];
                data.dreams    = results[1];
                reponse(type, query, data);
            });
            break;
        case 'tag':
            tagQuery(function(err, tags) {
                if (err) return reponse(type, query, []);

                reponse(type, query, tags);
            }, 10);
            break;
        case 'dream':
            dreamQuery(function(err, dreams) {
                if (err) return reponse(type, query, []);

                reponse(type, query, dreams);
            });
            break;
        case 'user':
            Account
            .find({
                username: new RegExp(common.quote(query), 'i')
            })
            .lean()
            .select('_id username avatar_mini bio dreams fans')
            .limit(9)
            .sort('username')
            .exec(function(err, users) {
                if (err) {
                    return next(err);
                }

                reponse(type, query, users);
            });
            break;
        default:
            break;
    }
});

// 查询tag
router.get('/tags', function(req, res, next) {
    req.session.redirectTo = req.originalUrl;

    if (!req.query) {
        return res.json({
            info: 'success!',
            data: {
                tags: []
            },
            result: 0
        });
    }

    var query = req.query.key;

    if (typeof query !== "string") {
        return res.json({
            info: 'success!',
            data: {
                tags: []
            },
            result: 0
        });
    }

    query = query.trim();

    // 查询耗时测试
    var start = new Date().getTime();

    Tag.find({
        key: new RegExp(common.quote(query), 'i')
    }, "_id key")
        .lean()
        .sort('key')
        .limit(100)
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

// 查询tag
router.get('/tag', function(req, res, next) {
    req.session.redirectTo = req.originalUrl;

    if (!req.query) {
        return res.json({
            info: 'success!',
            data: {
                tag: null
            },
            result: 0
        });
    }

    var query = req.query.key;

    if (typeof query !== "string") {
        return res.json({
            info: 'success!',
            data: {
                tag: null
            },
            result: 0
        });
    }

    query = query.trim();

    // 查询耗时测试
    var start = new Date().getTime();

    Tag.findOne({
        key: query
    }, "key description")
        .lean()
        .exec(function(err, tag) {
            if (err) {
                return next(err);
            }

            res.json({
                info: 'success!',
                data: {
                    tag: tag
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

module.exports = router;
