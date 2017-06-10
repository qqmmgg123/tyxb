var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

var Image = new Schema({
    _belong_u : { type: Schema.Types.ObjectId, ref: 'Account', require: true },
    name      : { type: String, required: true, minlength: 1, trim: true },
    dir       : { type: String, require: true, minlength: 1, trim: true },
    usage     : { type: Number, default: 0, require: true },
    width     : { type: Number, default: 0 },
    height    : { type: Number, default: 0 },
    size      : { type: Number, default: 0 },
    date      : { type: Date, default: Date.now }
});

module.exports = mongoose.model('Image', Image);
