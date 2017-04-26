var mongoose = require('mongoose')
, Schema     = mongoose.Schema;

var Role = new Schema({
    type        : { type: String, unique: true, min: 2, max: 50, trim: true, default: '', required: true, dropDups: true },
    title       : { type: String, min: 1, max: 120, trim: true, default: '', required: true },
    description : { type: String, min: 1, max: 150, trim: true, default: '', },
    date        : { type: Date, default: Date.now }
});

Role.index({ unique: true });
module.exports = mongoose.model('Role', Role);
