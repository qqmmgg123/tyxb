var mongoose = require('mongoose')
, Schema     = mongoose.Schema;

var Permission = new Schema({
    type        : { type: String, unique: true, min: 2, max: 50, trim: true, default: '', required: true, dropDups: true },
    name        : { type: String, min: 1, max: 50, trim: true, default: '', required: true },
    description : { type: String, min: 1, max: 150, trim: true, default: '', required: true },
    date        : { type: Date, default: Date.now }
});

Permission.index({ unique: true });

// 创建权限
Permission.statics.create = function(fields, cb) {
    var self = this;

    this.findOne({ 
        type: fields.type
    })
    .select('_id')
    .lean()
    .exec(function(err, doc) {
        if (err) return cb(err, null);

        if (doc) return cb(new Error("Permission has exist."), null);

        doc = new self(fields);

        doc.save(function(err) {
            if (err) return cb(err, null);

            cb(null, doc);
        });
    });
}

module.exports = mongoose.model('Permission', Permission);
