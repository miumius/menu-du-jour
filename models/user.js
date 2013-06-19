'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var userSchema = new Schema({
	name: String,
	role: {type: ObjectId, ref: 'Role'}
});

module.exports = mongoose.model('User', userSchema);