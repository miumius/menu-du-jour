'use strict';
var User = require('../models/user.js'),
    Role = require('../models/role.js');
/*
 * GET users listing.
 */

exports.list = function(req, res){
	User.find().populate('role').exec(function(err, users){
		res.json(users);
	});
};

exports.changeRole = function(req, res){
  User.findById(req.param('id'), function(err, user){
    if(!err){
      Role.findById(req.param('roleId'), function(err, role){
        user.role = role;
        user.save();
        res.send(200);
      });
    }
  });
};

exports.create = function(req, res){
  var newUser = { name : req.param('name'), role : req.param('role')._id};
  User.findOne(newUser, function(err, user){
    if(user === null){
      User.create(newUser, function(err){
        if(!err){
          res.send(200);
        }
      });
    }
  });
};

exports.delete = function(req, res){
  User.findByIdAndRemove(req.param('id'), function(err){
    if(!err){
      res.send(200);
    }
  });
};

exports.setRole = function(req, res, next){
  if(req.session.st !==undefined && req.session.role === undefined){
    var user = {name : req.session.name};
    User.findOne(user).populate('role').exec(function(err, user){
      if(!err){
        req.session.role = user.role;
        console.log('attribution du role : ' + req.session.role.libelle + ' à ' + req.session.name);
      }
    });
  }
  return next();
};

exports.isAuthorized = function(libelleRole){
  return function(req, res, next){
    //je recupere le role de la base
    if(req.session.name !== undefined){
      var user = {name : req.session.name};
      User.findOne(user).populate('role').exec(function(err, user){
        if(!err){
          Role.findOne({libelle : libelleRole}).exec(function(err, role){
            if(!err){
              if(user.role.level >= role.level){
                next();
              }
              else{
                res.send(403);
              }
            }
            else{
              res.send(403);
            }
          });
        }
      });
    }
    else{
      res.send(403);
    }
  };
};