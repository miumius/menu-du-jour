'use strict';

var Plat = require('../models/plat.js'),
    Menu = require('../models/menu.js');

exports.create = function(req, res){
	Plat.findById(req.params.plat, function(err, plat){
    if(plat){
      Menu.findById(req.params.id, function(err, menu){
        menu.plats.push(plat);
        menu.save();
        res.send(200);
      });
    }
  });
};

exports.read = function(req, res){
	var year = parseInt(req.params.year, 10),
      month = parseInt(req.params.month, 10),
      day = parseInt(req.params.day, 10);

  var start = new Date(year, month, day, 0, 0, 0),
      end = new Date(year, month, day , 23, 59, 59);

  Menu.findOne({date: {$gte: start, $lte: end}}).populate('plats.type').exec(function(err, menu){
    if(menu){
      res.json(menu);
    }
    else{
      new Menu({date: new Date(year, month, day)}).save(function (err, menu) {
        if(menu){
          res.json(menu);
        }
      });
    }
  });
};

exports.update = function(req, res){
	Plat.findById(req.params.idPlat, function(err, plat){
    if(plat){
      Menu.findById(req.params.id, function(err, menu){
        menu.plats.push(plat);
        menu.save();
        res.send(200);
      });
    }
  });
};

exports.delete = function(req, res){
  Menu.findById(req.params.id, function(err, menu){
    menu.plats.id(req.params.idPlat).remove();
    menu.save();
    res.send(200);
  });
};

exports.platsNonInclus = function(req, res){
  Menu.findById(req.params.id).exec(function(err, menu){
    var platsIds = [];
    menu.plats.forEach(function(plat){
      platsIds.push(plat);
    });
    Plat.find({'_id' : { $nin : platsIds}}).populate('type').exec(function(err, plats){
      res.json(plats);
    });
  });
};