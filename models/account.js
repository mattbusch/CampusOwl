var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');


var Account = new Schema({
	username: {
		required: true,
		type: String,},
	sched: [String],
	email: {
		required: true,
		type: String,},
	password: {
		type: String,},
	name: {
		required: true,
		type: String,},
	type: {
		required: true,
		type: String,},

	approved: Boolean,
	schoolcode: String,
	ieccode: String,
	description: String,
	image: String,
	sessions: [String],
	tokens: [String]
});

Account.plugin(passportLocalMongoose);
module.exports = mongoose.model('Account', Account);