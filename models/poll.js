var settings = require('../const/settings');

module.exports = function(schema, options) {
    schema.statics.getScore = function(id, cb) {
        this.aggregate([{ 
            $match: {
                '_id': id 
            }, 
        }, { 
            $project: {
                vote: { 
                    "$subtract": [ 
                        { "$size": "$good" },
                        { "$size": "$bad" }
                    ]
                }
            }
        }], function(err, res) {
            if (err || !res || res.length === 0) {
                return cb(err || settings.UNKNOW_ERR, 0);
            }

            cb(null, res[0].vote);
        });
    }

    schema.statics.goodIt = function(id, uid, cb) {
        var self = this;
        this.update({ '_id': id }, 
            { 
                $addToSet : { 'good' : uid },
                $pull     : { 'bad'  : uid }
            }
        )
        .exec(function(err, res) {
            if (err) {
                return cb(err, 0);
            }

            self.getScore(id, cb);
        });
    }

    schema.statics.badIt = function(id, uid, cb) {
        var self = this;
        this.update({ '_id': id }, 
            { 
                $addToSet : { 'bad'  : uid },
                $pull     : { 'good' : uid } 
            }
        )
        .exec(function(err, res) {
            if (err) {
                return cb(err, 0);
            }

            self.getScore(id, cb);
        });
    }

    schema.statics.cancelGood = function(id, uid, cb) {
        var self = this;
        this.update({ '_id': id }, 
            { 
                $pull: { 'good' : uid } 
            } 
        )
        .exec(function(err, res) {
            if (err) {
                return cb(err, 0);
            }

            self.getScore(id, cb);
        });
    }

    schema.statics.cancelBad = function(id, uid, cb) {
        var self = this;
        this.update({ '_id': id }, 
            { 
                $pull: { 'bad' : uid } 
            } 
        )
        .exec(function(err, res) {
            if (err) {
                return cb(err, 0);
            }
            
            self.getScore(id, cb);
        });
    }
}
