var mongoose = require('mongoose')
, Schema = mongoose.Schema;

var History = new Schema({
    browse_u     : { type: Schema.Types.ObjectId, ref: 'Account' },
    browse_d     : { type: Schema.Types.ObjectId, ref: 'Dream' },
    browse_date  : { type: Date, default: Date.now },
    browse_times : { type: Number, default: 0 },
});

History.index({ unique: true });

module.exports = mongoose.model('History', History);
