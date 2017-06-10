var mongoose = require('mongoose')
, async = require("async")
, Schema = mongoose.Schema
, poll   = require('./poll')
, settings = require('../const/settings');

var Comment = new Schema({
    content   : { type: String, required: true, minlength: 1, trim: true },
    _belong_u : { type: Schema.Types.ObjectId, ref: 'Account' },
    _belong_d : { type: Schema.Types.ObjectId, ref: 'Dream' },
    _reply_u  : { type: Schema.Types.ObjectId, ref: 'Account' },
    _reply_c  : { type: Schema.Types.ObjectId, ref: 'Comment' },
    _reply_d  : { type: Schema.Types.ObjectId, ref: 'Dream' },
    comments  : [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    good      : [{ type: Schema.Types.ObjectId, ref: 'Account' }],
    bad       : [{ type: Schema.Types.ObjectId, ref: 'Account' }],
    isremove  : { type: Boolean, default: false },
    date      : { type: Date, default: Date.now }
});

Comment.index({'comments': 1});
Comment.index({'good': 1});
Comment.index({'bad': 1});
Comment.plugin(poll);

Comment.statics.create = function(opts, next) {
    var self   = this,
        oid    = opts.object._belong_u,
        fields = {
            _belong_u : opts.uid,
            content   : opts.content.trim(),
            _reply_u  : oid
        };

    switch(opts.reply) {
        case settings.OBJEXT_TYPE.DREAM:
            category = "dream";
            cname    = settings.OBJECT.DREAM.CNNAME;
            rname    = "留言";
            fields._belong_d = opts.object._id;
            fields._reply_d  = opts.object._id;
            break;
        case settings.OBJEXT_TYPE.COMMENT:
            category = "comment";
            cname    = "留言";
            rname    = "回复";
            fields._belong_d = opts.object._belong_d;
            fields._reply_c  = opts.object._id;
            break;
        default:
            return next(new Error("参数错误，创建失败..."), null);
            break;
    }

    var comment = new self(fields);

    comment.save(function(err) {
        if (err) return next(err, null);

        self.model('Account').findById(oid, "_id", function(err, other) {
            if (err || !other) {
                var err = err || new Error("回复成功，但您回复的用户已经不存在，因此不能通知到对方。");
                return next(err, null);
            }

            var url        = '/dream/' + comment._belong_d + '?cid=' + comment.id,
                msgfields  = {
                    _belong_u: oid,
                    url      : url,
                    title    : '你有新的' + rname,
                    content  : comment.content
                };

            var message = new (self.model('Message'))(msgfields);

            message.save(function(err) {
                if (err) return next(err, null);

                self.model('Account').update({
                    _id: oid
                }, { $addToSet: { 'messages': message._id } }, function(err, ret) {
                    if (err) return next(err, null);

                    next(null, comment)
                });
            });
        });
    });
};

Comment.methods.markRemove = function(next) {
    var self    = this,
        handles = [
            function(cb) {
                self.model('Account').update({ 
                    "_id": self._belong_u
                }, { $pull: { "comments": self._id } }, function(err, res) {
                    if (err) {
                        return cb(err);
                    }

                    cb(null);
                });
            },
            function(cb) {
                self.model('Dream').update({ 
                    "_id": self._belong_d
                }, { $pull: { "comments": self._id } }, function(err, res) {
                    console.log(res);
                    if (err) {
                        return cb(err);
                    }

                    cb(null);
                });
            }];

    async.parallel(handles, function(err) {
        if (err) return next(err);
        next(null);
    });
}

Comment.pre('remove', function(next) {
    var self    = this,
        handles = [
            function(cb) {
                self.model('Account').update({ 
                    "_id": self._belong_u
                }, { $pull: { "comments": self._id } }, function(err, res) {
                    if (err) {
                        return cb(err);
                    }

                    cb(null);
                });
            },
            function(cb) {
                self.model('Dream').update({ 
                    "_id": self._belong_d
                }, { $pull: { "comments": self._id } }, function(err, res) {
                    if (err) {
                        return cb(err);
                    }

                    cb(null);
                });
            }];

    if (self._reply_c) {
        handles.push(function(cb) {
            self.constructor.update({ 
                "_id": self._reply_c
            }, { $pull: { "comments": self._id } }, function(err, res) {
                if (err) {
                    return cb(err);
                }

                cb(null);
            });
        });
    }

    async.parallel(handles, function(err) {
        if (err) return next(err);
        next(null);
    });
});

Comment.post('remove', function(doc, next) {
    if (!doc) return next();

    var cid = doc._reply_c,
        key = "_reply_c";
    
    if (doc._reply_d) {
        cid = doc._reply_d;
        key = "_reply_d";
    };

    if (!cid) return next();

    var query = {},
        self  = this;
    query[key] = cid;

    this.constructor.findById(
        cid,
        '_belong_u _belong_d _reply_c _reply_d isremove',
        function(err, cparent) {
            if (err) return next();

            if (!cparent) {
                return next();
            }

            self.constructor.count(query, function(err, cnum) {
                if (err) return next();

                if (cnum === 0 && cparent.isremove) {
                    cparent.remove(function(err) {
                        return next();
                    });
                }
            });
        });
});

Comment.pre('save', function(next) {
    var self = this;
    var handles = [
        function(cb){
            self.model('Dream').update({ "_id": self._belong_d }, 
                { 
                    $addToSet : { 'comments'  : self._id },
                    $set: { 'last_comment': new Date() },
                }
            )
                .exec(function(err, res) {
                    if (err) {
                        return cb(err, res);
                    }

                    cb(null, res);
                });
        },
        function(cb){
            self.model('Account').update({ "_id": self._belong_u }, 
                { 
                    $addToSet : { 'comments'  : self._id }
                }
            )
                .exec(function(err, res) {
                    if (err) {
                        return cb(err, res);
                    }

                    cb(null, res);
                });
        }];

    if (self._reply_c) {
        handles.push(function(cb) {
            self.constructor.update({ 
                "_id": self._reply_c
            }, { $addToSet: { "comments": self._id } }, function(err, res) {
                if (err) {
                    return cb(err);
                }

                cb(null);
            });
        });
    }

    async.parallel(handles,
        function(err, rets){
            if (err) return next(err);
            next(null);
        }
    );
});

module.exports = mongoose.model('Comment', Comment);
