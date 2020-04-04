var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Song = new Schema({
    name: {
        type: String,
        default: ''
    },
    album: {
        type: String,
        default: ''
    },
    format: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model('Song', Song);
