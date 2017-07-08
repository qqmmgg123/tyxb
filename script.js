var async = require("async")
  , common = require("./common")
  , mongoose = require('mongoose')
  , Permission = require("./models/permission")
  , crypto = require('crypto')
  , Dream = require("./models/dream")
  , Account = require("./models/account")
  , Tag = require("./models/tag")
  , Text = require("./models/text")
  , argv = require('yargs').argv
  , cheerio = require('cheerio')
  , charset = require("superagent-charset")
  , striptags = require('./striptags')
  , request = require('superagent');

charset(request);

var command = argv.command;

console.log(command);

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/sapohr');

// 创建权限
function createPermission(type, name, desc) {
    console.log(arguments);
    Permission.create({
        type: type,
        name: name,
        description: desc
    }, function(err, perm) {
        if (err) {
            return console.log(err.message);
        }

        console.log('Create perm seccess.', perm._id);
    });
}

// 查找链接
function queryLink() {
    const pageUrl = "http://www.suopoearth.com";

    request.get(pageUrl)
        .charset('gbk')
        .end(function(err, pres){
            if (err) {
                return console.log(err.message);
            }

            var $ = cheerio.load(pres.text, {decodeEntities: false});

            console.log($('title').html());
        })
}

// 设置用户名
function setUsername() {
    Text.find({}, '_id summary content', function(err, docs) {
        docs.forEach((doc) => {
            console.log(doc.summary, doc.content);
            Dream.update({ _id: doc._belong_d }, {
                $set: {
                    summary: doc.summary,
                    text   : doc.content
                }
            }, { upsert: true }, function(err) {
                if (err) return console.log(err.message);
                console.log('Set Username Success!')
            });
        })
    });
}

// 更新字段
function setField() {
    console.log('Set filed progress.')
    Dream.find({}, '_id image', function(err, docs) {
        if (err) return console.log(err.message);
        
        console.log(docs);

        docs.forEach((doc) => {
            if (doc.image) {
                console.log(doc.image, doc._id);
                Dream.update({ _id: doc._id }, {
                    $set: {
                        pic: doc.image.replace('uploads', 'pic')
                    }
                }, { upsert: true }, function(err) {
                    if (err) return console.log(err.message);
                    console.log('Set last_online Success!')
                });
            }
        })

    });
}

switch(command) {
    case 'createperm':
        if (!argv.type || !argv.name || !argv.desc) {
            return console.log('No arguments.');
        }
        createPermission(argv.type, argv.name, argv.desc);
        break;
    case 'queryLink':
        queryLink();
        break;
    case 'setUsername':
        setUsername();
        break;
    case 'setField':
        console.log('start set filed.')
        setField();
        break;
    default:
        break;
}
