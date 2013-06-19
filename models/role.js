'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var roleSchema = new Schema({
	libelle : String,
	level: Number
});

module.exports = mongoose.model('Role', roleSchema);