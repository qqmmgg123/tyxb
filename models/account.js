var mongoose = require('mongoose')
, async = require("async")
, Schema = mongoose.Schema
, db = require('./db')
, user = require('./user');

var Account = new Schema({
    avatar         : { type: String, maxlength: 150, default: '/images/avatar.png' },
    avatar_mini    : { type: String, maxlength: 150, default: '/images/avatar_mini.png' },
    bio            : { type: String, trim: true, maxlength: 80, default: '' },
    mood           : { type: String, trim: true, maxlength: 30, default: '平静' },
    health         : { type: String, trim: true, maxlength: 30, default: '良好' },
    main_tag       : { type: Schema.Types.ObjectId, ref: 'Tag' },
    follow_tags    : [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    follows        : [{ type: Schema.Types.ObjectId, ref: 'Account' }],
    fans           : [{ type: Schema.Types.ObjectId, ref: 'Account' }],
    dreams         : [{ type: Schema.Types.ObjectId, ref: 'Dream' }],
    comments       : [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    favourites     : [{ type: Schema.Types.ObjectId, ref: 'Dream' }],
    messages       : [{ type: Schema.Types.ObjectId, ref: 'Message' }],
    msgreviewdate  : { type: Date },
    last_online    : { type: Date },
    date           : { type: Date,  default: Date.now }
});

Account.index({'follow_tags':1});
Account.index({'follows':1});
Account.index({'fans':1});
Account.index({'dreams':1});
Account.index({'comments':1});
Account.index({'favourites':1});
Account.index({'messages':1});
Account.plugin(user);
Account.plugin(db);

module.exports = mongoose.model('Account', Account);
