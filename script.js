var async = require("async")
  , common = require("./common")
  , mongoose = require('mongoose')
  , Permission = require("./models/permission")
  , crypto = require('crypto')
  , Dream = require("./models/dream")
  , Account = require("./models/account")
  , Tag = require("./models/tag")
  , argv = require('yargs').argv
  , cheerio = require('cheerio')
  , charset = require("superagent-charset")
  , request = require('superagent');

charset(request);

var command = argv.command;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/suopoearth');

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
    default:
        break;
}
