var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

var Dir = new Schema({
    name       : { type: String, required: true, minlength: 1, trim: true },
    type       : { type: String, required: true, minlength: 1, trim: true },
    totel      : { type: Number, default: 0 },
    date       : { type: Date, default: Date.now }
});

module.exports = mongoose.model('Dir', Dir);
