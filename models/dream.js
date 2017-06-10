var mongoose = require('mongoose')
    , async = require("async")
    , db     = require('./db')
    , poll   = require('./poll')
    , striptags = require('../striptags')
    , Schema = mongoose.Schema;

var Dream = new Schema({
    content      : { type: String, required: true, minlength: 1, trim: true },
    _belong_u    : { type: Schema.Types.ObjectId, ref: 'Account', require: true },
    _belong_t    : { type: Schema.Types.ObjectId, ref: 'Tag' }, 
    comments     : [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    good         : [{ type: Schema.Types.ObjectId, ref: 'Account' }],
    bad          : [{ type: Schema.Types.ObjectId, ref: 'Account' }],
    weight       : { type: Number, default: 0 },
    _followers_u : [{ type: Schema.Types.ObjectId, ref: 'Account' }],
    category     : { type: String, trim: true, default: 'news' },
    summary      : { type: String, require: true, maxlength: 150, trim: true },
    text         : { type: String, trim: true },
    link         : { type: String, trim: true },
    site         : { type: String, trim: true, default: 'i.share.it' },
    cover        : { type: String, trim: true },
    thumbnail    : { type: String, trim: true },
    mthumbnail   : { type: String, trim: true },
    image        : { type: String, trim: true },
    isremove     : { type: Boolean, default: false },
    date         : { type: Date, default: Date.now },
    last_comment : { type: Date, default: Date.now },
});

Dream.index({'_followers_u':1});
Dream.index({'nodes':1});
Dream.index({'comments':1});
Dream.index({'good':1});
Dream.index({'bad':1});
Dream.plugin(poll);

Dream.methods.extract = function() {
    let str  = striptags(this.text);
    this.summary = str.length > 147? str.slice(0, 147) + '...':str;
};

Dream.methods.userRemove = function(next) {
    var self = this;
    self.model('Comment').count({ _reply_d: self._id }, function(err, cnum) {
        if (err) return next(err);

        if (cnum > 0) {
            self.markRemove(function(err) {
                if (err) {
                    return next(err);
                }

                self.constructor.update({ 
                    _id: self._id
                }, { 
                    $set: { isremove: true }
                }, function(err, res) {
                    if (err) {
                        return next(err);
                    }

                    next(null);
                });
            });
        } else {
            self.remove(function(err) {
                if (err) {
                    return next(err);
                }

                next(null);
            });
        }
    });
}

Dream.methods.tagRemove = function(next) {
    var self = this;

    async.parallel([
        function(cb) {
            self._belong_t = undefined;
            self.save(function(err) {
                if (err) return cb(err);
                cb(null);
            });
        },
        function(cb) {
            self.model('Tag').update({ 
                "_id": self._belong_t
            }, { $pull: { "dreams": self._id } }, function(err, res) {
                if (err) {
                    return cb(err);
                }

                cb(null);
            });
        }], function(err) {
            if (err) return next(err);
            next(null);
        }
    );
};

Dream.methods.markRemove = function(next) {
    var self = this;
    async.parallel([
        function(cb) {
            self.model('Account').update({ 
                "_id": self._belong_u
            }, { $pull: { "dreams": self._id } }, function(err, res) {
                if (err) {
                    return cb(err);
                }

                cb(null);
            });
        },
        function(cb) {
            self.model('Tag').update({ 
                "_id": self._belong_t
            }, { $pull: { "dreams": self._id } }, function(err, res) {
                if (err) {
                    return cb(err);
                }

                cb(null);
            });
        }], function(err) {
            if (err) return next(err);
            next(null);
        }
    );
}

Dream.methods.following = function(uid, cb) {
    var self = this;
    this.constructor.update({ _id: self._id }, { $addToSet: { _followers_u: uid } }, function(err, ret) {
        if (err) return cb(err, null);

        if (ret.nModified === 1) {
            self.constructor.model('Account').update({ "_id": uid }, 
                { 
                    $addToSet : { 'favourites'  : self._id }
                }
            )
                .exec(function(err, ret) {
                    if (err) {
                        return cb(err);
                    }

                    cb(null);
                });
        }
        else {
            var failedErr = new Error("收藏失败, 也许您已经收藏了该内容...");
            return cb(failedErr, null);
        }
    });
};

Dream.methods.cfollowing = function(uid, cb) {
    var self = this;

    this.constructor.update({ _id: self._id }, { $pull: { _followers_u: uid } }, function(err, ret) {
        if (err) return cb(err, null);

        if (ret.nModified === 1) {
            self.constructor.model('Account').update({ "_id": uid }, 
                { 
                    $pull : { 'favourites'  : self._id }
                }
            )
                .exec(function(err, res) {
                    if (err) {
                        return cb(err);
                    }

                    cb(null);
                });
        }
        else {
            var failedErr = new Error("取消收藏失败, 也许您在取消收藏了一个您没有收藏过的内容...");
            return cb(failedErr, null);
        }
    });
}

Dream.pre('save', function(next) {
    let pushToUser     = (cb) => {
        this.model('Account').update({ '_id': this._create_u }, 
            { 
                $addToSet: { 'dreams' : this._id } 
            } 
        ).exec((err, ret) => { 
            if (err) {
                return cb(err);
            }

            cb(null);
        });
    };

    let pushToTag = (cb) => {
        this.model('Tag').update({ '_id': this._belong_t }, 
            { 
                $addToSet: { 'dreams' : this._id } 
            } 
        ).exec((err, ret) => { 
            if (err) {
                return cb(err);
            }

            cb(null);
        });
    };

    if (this._belong_t) {
        var promises = [pushToUser, pushToTag];
        async.parallel(promises, function(err, rets) {
            if (err) return next(err);
            next(null)
        });
    }else{
        pushToUser((err, ret) => {
            if (err) return next(err);
            next(null)
        });
    }
});

Dream.pre('remove', function(next) {
    var self = this;
    async.parallel([
        function(cb) {
            self.model('Account').update({ 
                "_id": self._belong_u
            }, { $pull: { "dreams": self._id } }, function(err, res) {
                if (err) {
                    return cb(err);
                }

                cb(null);
            });
        },
        function(cb) {
            self.model('Tag').update({ 
                "_id": self._belong_t
            }, { $pull: { "dreams": self._id } }, function(err, res) {
                if (err) {
                    return cb(err);
                }

                cb(null);
            });
        }], function(err) {
            if (err) return next(err);
            next(null);
        }
    );
});

module.exports = mongoose.model('Dream', Dream);
