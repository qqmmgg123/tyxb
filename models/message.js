var mongoose = require('mongoose')
, Schema = mongoose.Schema;

var Message = new Schema({
    _belong_u : { type: Schema.Types.ObjectId, ref: 'Account' },
    url       : { type: String, required: true, trim: true },
    title     : { type: String, required: true, trim: true },
    content   : { type: String, trim: true },
    date      : { type: Date, default: Date.now }
});

Message.pre('remove', function(next) {
    this.model('Account').update({ 
        "_id": this._belong_u
    }, { $pull: { "messages": this._id } }, function(err, messages) {
        if (err) return next(err);
        next(null);
    });
});
module.exports = mongoose.model('Message', Message);
