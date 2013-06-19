'use strict';

var Type = require('../models/type.js');

exports.list = function(req, res) {
	Type.find().exec(function(err, types){
		res.json(types);
	});
};