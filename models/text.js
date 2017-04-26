var mongoose = require('mongoose')
    , striptags = require('../striptags')
    , Schema = mongoose.Schema;

var Text = new Schema({
    content    : { type: String, require: true, minlength: 1, trim: true },
    summary    : { type: String, require: true, maxlength: 150, trim: true, default: '' },
    images     : { type: String },
    _belong_u  : { type: Schema.Types.ObjectId, ref: 'Account' },
    _belong_d  : { type: Schema.Types.ObjectId, ref: 'Dream' },
    _belong_n  : { type: Schema.Types.ObjectId, ref: 'Node' },
    date       : { type: Date, default: Date.now }
});

Text.methods.extract = function() {
    var self = this;

    var str  = striptags(this.content)
    this.summary = str.length > 147? str.slice(0, 147) + '...':str;

    this.images  = (function(str) {
        var m,
            i = 0,
            urls = [], 
            rex = /<img.*?src="([^">]*\/([^">]*?))".*?>/g;

        while ( (m = rex.exec( str )) !== null && i < 6 ) {
            urls.push( m[1].replace('/pic/', '/picmini/') );
            i++;
        }

        return urls.join('|');
    })(this.content);
};

module.exports = mongoose.model('Text', Text);
