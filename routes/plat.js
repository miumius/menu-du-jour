'use strict';

var Plat = require('../models/plat.js');
exports.list = function(req, res){
  Plat.find().populate('type').exec(function(err, plats){
    res.json(plats);
  });
};

exports.create = function(req, res){
  var newPlat = { name : req.param('name'), type : req.param('type')._id};
  Plat.findOne(newPlat, function(err, plat){
    if(plat === null){
      Plat.create(newPlat, function(err, createdPlat){
        res.json(createdPlat);
      });
    }
  });
};