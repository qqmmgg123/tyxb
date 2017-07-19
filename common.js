(function (factory) {
    module.exports = factory(
        require('http'),
        require('util'),
        require('async'),
        require('./const/settings'),
        require('./models/comment')
    );
} (function (http, util, async, settings, Comment) {
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
        },

        /**
         * 根据 ip 获取获取地址信息
         */
        getIpInfo: function(ip, cb) {
            ip = this.ipformat(ip);

            const sina_server = 'http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=json&ip=';
            const url = sina_server + ip;
            http.get(url, function(res) {
                var code = res.statusCode;
                if (code == 200) {
                    res.on('data', function(data) {
                        try {
                            cb(null, JSON.parse(data));
                        } catch (err) {
                            cb(err);
                        }
                    });
                } else {
                    cb({ code: code });
                }
            }).on('error', function(e) { cb(e); });
        },

        /**
         * 格式化ip地址
         */
        ipformat: function(ip) {
            const match = ip.match(/\d+\.\d+\.\d+\.\d+/),
                defaultIp = '0.0.0.0';

            return match? match[0]:defaultIp;
        },

        /**
         * 优化时间显示
         */
        dateBeautify: function(date) {
            var now       = new Date(),
                year      = date.getFullYear(),
                hour      = 60 * 60 * 1000,
                day       = 24 * hour,
                currDate  = this.dateFormat(new Date, 'yyyy-MM-dd'),
                today     = new Date(currDate + ' 00:00:00').getTime(),
                yesterday = today - day,
                currTime  = date.getTime(),
                cHStr     = this.dateFormat(date, 'hh:mm');

            if (currTime >= today) {
                var time    = (currTime - today) / hour;
                var cHour   = date.getHours();
                var amCHour = cHour - 12;
                var cMStr   = this.dateFormat(date, 'mm');
                var str     = time <= 12? '上午 ' + cHStr:'下午 ' + (amCHour < 10? amCHour: '0' + amCHour) + ':' + cMStr;
                return str;
            }else if (currTime < today && currTime >= yesterday) {
                return "昨天 " + cHStr;
            }else {
                var curYear = now.getFullYear(),
                    format  = 'MM-dd hh:mm';
                if (year < curYear) { format  = 'yyyy-MM-dd hh:mm' };
                return this.dateFormat(date, format);
            }
        },
        /**
         * 格式化时间
         */
        dateFormat: function(date, format){
            var o = {
                "M+" : date.getMonth()+1, //month
                "d+" : date.getDate(),    //day
                "h+" : date.getHours(),   //hour
                "m+" : date.getMinutes(), //minute
                "s+" : date.getSeconds(), //second
                "q+" : Math.floor((date.getMonth()+3)/3),  //quarter
                "S" : date.getMilliseconds() //millisecond
            }

            if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
                (date.getFullYear()+"").substr(4 - RegExp.$1.length));
            for(var k in o) if(new RegExp("("+ k +")").test(format))
                format = format.replace(RegExp.$1,
                    RegExp.$1.length==1 ? o[k] :
                    ("00"+ o[k]).substr((""+ o[k]).length));

            return format;
        }
    }

    return common;
}));
