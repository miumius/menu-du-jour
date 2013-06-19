'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var typeSchema = new Schema({
	name: String
});

module.exports = mongoose.model('Type', typeSchema);
