(function (factory) {
    module.exports = factory(
        require('async'),
        require('./const/settings'),
        require('./models/comment')
    );
} (function (async, settings, Comment) {
    var common = {

        maxtime : 1500,

        extractHostname: function (url) {
            var hostname;
            //find & remove protocol (http, ftp, etc.) and get the hostname
            if (url.indexOf("://") > -1) {
                hostname = url.split('/')[2];
            }
            else {
                hostname = url.split('/')[0];
            }

            //find & remove port number
            hostname = hostname.split(':')[0];

            return hostname;
        },

        quote: function(str) {
            return (str + '').replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
        },

        randomString: function(len) {
            var buf = []
                , chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
                , charlen = chars.length;

            for (var i = 0; i < len; ++i) {
                buf.push(chars[this.getRandomInt(0, charlen - 1)]);
            }

            return buf.join('');
        },

        getRandomInt: function(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        makeCommon: function(data, res) {
            if (!data.data) {
                data.data = {};
            }
            data.data.messages = res.msgs;
            return data;
        },

        getFlash: function (req, name) {
            var flash = req.flash(name);
            if (flash && flash.length > 0){
                return flash[0];
            }
            return '';
        },

        hotSort: function() {
            return { '$divide': [
                this.roundAg({
                    '$multiply': [
                        this.product,
                        1000000
                    ]
                }),
                1000000
            ] };
        },

        ifElseAg: function(cond, then, el) {
            return {
                "$cond": { 
                    "if": cond, 
                    "then": then,
                    "else": el
                } 
            }
        },

        roundAg: function(num) {
            var back = {
                '$multiply': [
                    {
                        '$subtract': [ 
                            num,
                            { '$trunc': num }
                        ]
                    },
                    100
                ]
            },
            refer = this.ifElseAg({
                '$gt': [
                    num,
                    0
                ]
            }, 50, -50);

            return this.ifElseAg(
                {
                    '$gte': [back, refer]
                },
                { '$ceil'  : num },
                { '$floor' : num }
            );
        },

        product: {
            '$add': [
                { 
                    "$log10": { 
                        "$cond": { 
                            "if": { 
                                "$gt": [ 
                                    { "$abs": '$$score' },
                                    1
                                ]
                            }, 
                            "then": { "$abs": '$$score' },
                            "else": 1
                        } 
                    } 
                },
                { 
                    '$divide': [
                        { 
                            '$multiply': [ 
                                { 
                                    "$cond": { 
                                        "if": { 
                                            $gt: [ '$$score', 0 ] 
                                        }, 
                                        "then": 1, 
                                        "else": { 
                                            "$cond": { 
                                                "if": { 
                                                    "$lt": [ '$$score', 0 ]
                                                }, 
                                                "then": -1, 
                                                "else": 0
                                            }
                                        }
                                    }
                                },  { 
                                    "$subtract": [
                                        { 
                                            "$divide": [
                                                { 
                                                    "$subtract": [
                                                        '$$time', 
                                                        new Date(1970,1,1).getTime()
                                                    ]
                                                }, 
                                                1000
                                            ] 
                                        }, 
                                        1134028003
                                    ] 
                                } 
                            ] 
                        }, 
                        45000
                    ]
                }
            ]
        }
    }

    return common;
}));
