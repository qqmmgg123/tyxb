var mongoose = require('mongoose')
, async      = require("async")
, settings   = require("../const/settings")
, errors     = require("../const/errmsgs")
, db         = require('./db')
, Schema     = mongoose.Schema;

var Tag = new Schema({
    key         : { type: String, unique: true, index: true, required: true, minlength: 2, maxlength: 24, trim: true, dropDups: true },
    description : { type: String, trim: true, default: '' },
    _create_u   : { type: Schema.Types.ObjectId, ref: 'Account' },
    president   : { type: Schema.Types.ObjectId, ref: 'Account' },
    roles       : [{ type: Schema.Types.ObjectId, ref: 'Role' }],
    permissions : [{ type: Schema.Types.ObjectId, ref: 'Permission' }],
    followers   : [{ type: Schema.Types.ObjectId, ref: 'Account' }],
    dreams      : [{ type: Schema.Types.ObjectId, ref: 'Dream' }],
    weight      : { type: Number, default: 0 },
    date        : { type: Date, default: Date.now }
});

Tag.index({'followers':1});
Tag.index({'dreams':1});
Tag.index({'permissions':1});
Tag.index({'roles':1});
Tag.index({ unique: true });

// 校验版面信息
Tag.statics.validation = function(req, cb) {
    if (!req.body) {
        return cb(new Error(settings.PARAMS_PASSED_ERR_TIPS), null);
    }

    var formData = req.body;

    if (typeof formData.key !== "string") {
        return cb(new Error(settings.PARAMS_PASSED_ERR_TIPS), null);
    }

    var key = 
        formData.key = 
        formData.key.trim();

    if (key.length === 0) {
        return cb(new Error(errors.MissTagNameError), null);
    }

    if (key.length > 24) {
        return cb(new Error(errors.TagNameLenMoreError), null);
    }

    return cb(null, formData);
}

// 创建学派
Tag.statics.create = function(fields, cb) {
    var self = this;

    this.findOne({ 
        key: fields.key
    })
    .select('_id')
    .lean()
    .exec(function(err, doc) {
        if (err) return cb(err, null);

        if (doc) return cb(new Error(settngs.TAG_EXIST_ERR), null);

        doc = new self(fields);

        doc.save(function(err) {
            if (err) return cb(err, null);

            cb(null, doc);
        });
    });
}

// 订阅版面
Tag.statics.subscribe = function(fields, cb) {
    var self = this;
    this.update({ _id: fields.tid }, { $addToSet: { followers: fields.uid } }, function(err, ret) {
        if (err) return cb(err, null);

        if (ret.nModified === 1) {
            self.model('Account').update({ '_id': fields.uid }, 
                { 
                    $addToSet: { 'follow_tags' : fields.tid } 
                } 
            )
            .exec((err, ret) => {
                if (err) return callback(err, null);
                cb(null, ret);
            });
        }
        else {
            var failedErr = new Error(errors.TagRepeatJoinError);
            return cb(failedErr, null);
        }
    });
}

// 取消订阅版面
Tag.statics.csubscribe = function(fields, cb) {
    var self = this;
    this.update({ _id: fields.tid }, { $pull: { followers: fields.uid } }, function(err, ret) {
        if (err) return cb(err, null);

        if (ret.nModified === 1) {
            self.model('Account').update({ '_id': fields.uid }, 
                { 
                    $pull: { 'follow_tags' : fields.tid } 
                } 
            )
            .exec((err, ret) => {
                if (err) return callback(err, null);
                cb(null, ret);
            });
        }
        else {
            var failedErr = new Error(errors.TagNoJoinExitError);
            return cb(failedErr, null);
        }
    });
}

Tag.plugin(db);
module.exports = mongoose.model('Tag', Tag);
