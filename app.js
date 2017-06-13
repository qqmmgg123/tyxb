var path = require('path')
  , flash = require('connect-flash')
  , settings = require("./const/settings")
  , express = require('express')
  , ejs = require('ejs')
  , device = require('express-device')
  , _ = require('lodash')
  , webpack = require('webpack')
  , cookieParser = require('cookie-parser')
  , session = require('cookie-session')
  , bodyParser = require('body-parser')
  , connect = require('connect')
  , mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , log = require('util').log
  , Account = require('./models/account.js')
  , Message = require("./models/message");

// mongoose
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/suopoearth');

// Passport config
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());
// Use the LocalStrategy within Passport.
passport.use(new LocalStrategy(Account.authenticate()));

var needWebpack = false;

if (needWebpack) {
    var webpackDevMiddleware = require("webpack-dev-middleware");
    var webpackHotMiddleware = require("webpack-hot-middleware");
    var webpackConfig = require('./webpack.config');
}

var common = {
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
};

// browser refresh
var reload = require('reload')
, http = require('http');

var app = express();

if (needWebpack) {
    var compiler = webpack(webpackConfig);
    app.use(webpackDevMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath,
        stats: {colors: true}
    }));
    app.use(webpackHotMiddleware(compiler, {
        log: console.log
    }));
}

app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');

// Test directory
//app.set('views', __dirname + '/mini/html');

// 设置js返回时间格式
app.set('json replacer', function (key, value) {
  if (this[key] instanceof Date) {
    // Your own custom date serialization
    value = this[key].getTime();
  }

  return value;
});

// 定义ejs函数
// 时间格式化
app.locals.timeFormat = function(date) {
    return common.dateBeautify(date);
}

// 搜索关键词高亮
app.locals.highLight = (html, query) => _.escape(html).replace(new RegExp('(' + query + ')', 'g'), '<b>$1</b>');

// 限制文本字数
app.locals.dlimit = function(str) {
    var limit = 150;
    return str.length > limit? (str.slice(0, limit - 3) + '...'):str;
}

// 计算年龄
app.locals.age = function(date) {
    //return new Date()
}

// Settings
app.locals.settings = settings;

app.set('port', process.env.PORT || 8080);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'pic')));
app.use(express.static(path.join(__dirname, 'picmini')));
app.use(express.static(path.join(__dirname, 'mpicmini')));
app.use(cookieParser('suopoearth'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({keys: ['secretkey1', 'secretkey2', '...']}));
app.use(flash());
app.use(device.capture());
app.use(passport.initialize());
app.use(passport.session());
device.enableDeviceHelpers(app);
device.enableViewRouting(app);

app.use(function(req, res, next) {
    res.msgs = 0;
    if (!req.user) {
        return next();
    }
    var uid   = req.user._id,
        rdate = req.user.msgreviewdate;

    var fields = {
        '_belong_u': uid
    };

    if (rdate) {
        fields.date = { 
            $gt: rdate
        }
    }

    Message.count(fields, function (err, count) {
        if (err) {
            return next();
        }
        res.msgs = count;
        next();
    });
});

// Register routes
app.use(function(req, res, next) {
    if (req.xhr) {
        res.set({ 
            'content-type'  : 'application/json; charset=UTF-8',
            'cache-control' : 'private, max-age=3600'
        });
    }else{
        res.set({
            'content-type'  : 'text/html; charset=UTF-8',
            'cache-control' : 'private, max-age=0'
        });
    }
    next();
});

// 
app.use(function(req, res, next) {
    const popups = ['imageview', 'signin', 'signup', 'share'],
          { path } = req,
          paths = path.split('/');

    if (paths && paths.length >= 3) {
        const len = paths.length,
              firstpath = paths[len - 2],
              secondpath = paths[len - 1];

        if (firstpath === 'popup' && popups.indexOf(secondpath) !== -1) {
            const popuppath = [firstpath, secondpath].join('/');
            req.url = req.url.replace(popuppath, '');
        }
    }
    next();
});

app.use('/', require('./routes'));
app.use('/search', require('./routers/search'));
app.use('/tag', require('./routers/tag'));
app.use('/dream', require('./routers/dream'));
app.use('/user', require('./routers/user'));
app.use('/comment', require('./routers/comment'));
app.use('/message', require('./routers/message'));
app.use('/settings', require('./routers/settings'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error(settings.PAGE_NOT_FOND_TIPS);
    err.status = 404;
    next(err);
});

function makeCommon(data, res) {
    if (!data.data) {
        data.data = {};
    }
    data.data.messages = res.msgs;
    return data;
}

// development error handler
// will print stacktrace
/*if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        if (req.xhr) {
        return res.json({
            info: err.message,
            result: 1
        });
    } else {
        res.render('pages/error', makeCommon({
            notice: '',
            title: settings.APP_NAME,
            user : req.user,
            message: err.message,
            error: err,
            data: {
            }
        }, res));
    }
    });
}*/

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);

    if (req.xhr) {
        res.json({
            info: err.message,
            result: 1
        });
    } else {
        res.render('pages/error', makeCommon({
            notice: '',
            title: settings.APP_NAME,
            user : req.user,
            message: err.message,
            error: err,
            data: {
            }
        }, res));
    }
});

var server = http.createServer(app);

reload(server, app);

//app.listen(app.get('port'));

server.listen(app.get('port'), function(){
    log('express server running on ' + 8080);
});
