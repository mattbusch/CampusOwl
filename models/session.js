var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Session = new Schema({
	seshid: String,
	seshmembers: [String],
	seshname: String,
	token: String
});

module.exports = mongoose.model('Session', Session);