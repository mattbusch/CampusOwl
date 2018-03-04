var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var School = new Schema({
	name: String,
	city: String,
	state: String,
	code: {type: String, unique: true},
	bcolor: String,
	fcolor: String,
	desc: String,
	NE: Boolean,
	MA: Boolean,
	SO: Boolean,
	MW: Boolean,
	WE: Boolean
});

module.exports = mongoose.model('School', School);