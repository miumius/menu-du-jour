'use strict';

var Role = require('../models/role.js');
/*
 * GET roles listing.
 */
exports.list = function(req, res){
	Role.find().exec(function(err, roles){
		res.json(roles);
	});
};

exports.loadRoles = function(){
	Role.find().exec(function(err, roles){
		return roles;
	});
};