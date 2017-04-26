var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

var Image = new Schema({
    url       : { type: String, required: true, minlength: 1, trim: true },
    _belong_u : { type: Schema.Types.ObjectId, ref: 'Account', require: true },
    _belong_d : { type: Schema.Types.ObjectId, ref: 'Dir', require: true },
    isused    : { type: Boolean, default: false, require: true },
    width     : { type: Number, default: 0 },
    height    : { type: Number, default: 0 },
    date      : { type: Date, default: Date.now }
});

module.exports = mongoose.model('Image', Image);
