'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var platSchema = new Schema({
	name: String,
	type: {type: ObjectId, ref: 'Type'}
});

module.exports = mongoose.model('Plat', platSchema);