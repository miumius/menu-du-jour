'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	Plat = require('./plat.js');

var menuSchema = new Schema({

	date: {type: Date, 'default': Date.now},
	plats: [Plat.schema]
});

module.exports = mongoose.model('Menu', menuSchema);