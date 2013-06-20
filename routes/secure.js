'use strict';
var https = require('https'),
	querystring = require('querystring');

exports.login = function (req, res){
	var data = querystring.stringify({
		username: req.param('username'),
		password: req.param('password')
	});

	var options = {
		host: 'intranet2',
		path: '/cas/v1/tickets',
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': data.length
		},
		rejectUnauthorized : false
	};

	var request = https.request(options, function(response) {
		console.log('reponse à l\'appel du ticket');
		response.setEncoding('utf8');

		response.on('data', function (data) {
			if(response.statusCode === 201){
				//on parse pour récupérer le ticket
				var result = /<form action="https:\/\/intranet2\/cas\/v1\/tickets\/([0-9a-zA-Z-]*)/.exec(data);
				req.session.ticket = result[1];
				req.session.name = req.param('username');
				res.send(200);
			}
			if(response.statusCode === 400){
				if(/error.authentication.credentials.bad/.exec(data)){
					res.send(400, {error : 'votre identifiant ou votre mot de passe sont incorrects'});
				}
			}
		});

		response.on('error', function (error) {
			res.send(400, {error :'impossible de contacter le serveur d\'authentification'});
			console.log(error);
		});
	});

	request.write(data);
	request.end();
};

exports.logout = function(req, res){
	var options = {
		host: 'intranet2',
		path: '/cas/v1/tickets/' + req.session.ticket,
		method: 'DELETE',
		rejectUnauthorized : false
	};

	var request = https.request(options, function(response) {
		console.log('status code : ' + response.statusCode);
		req.session.destroy();
		response.setEncoding('utf8');
		res.send(200);
		response.on('error', function (error) {
			res.send(400, {error :'impossible de contacter le serveur d\'authentification'});
			console.log(error);
		});
	});

	request.end();
};

exports.authenticationRequired = function(req, res, next){
	if(req.session !== undefined && req.session.ticket){
		next();
	}
	else{
		res.send(401);
	}
};