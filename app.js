'use strict';
/**
 * Module dependencies.
 */
var express = require('express'),
	menu = require('./routes/menu'),
	plat = require('./routes/plat'),
	type = require('./routes/type'),
	role = require('./routes/role'),
	user = require('./routes/user'),
	path = require('path'),
	https = require('https'),
	querystring = require('querystring'),
	mongoose = require('mongoose'),
	MongoStore = require('connect-mongo')(express);

mongoose.connect('mongodb://localhost/menus');

var app = express();
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');


app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
var sessionStore = new MongoStore({url: 'mongodb://localhost/menus-session'});
app.use(express.errorHandler({ dumpExceptions : true, showStack : true}));
app.use(express.cookieParser());
app.use(express.session({	store : sessionStore,
							secret : 'allez on y croit cette fois',
							key : 'menu-du-jour',
							maxAge : new Date(Date.now() + (3600000 * 24)),
							expires : new Date(Date.now() + (3600000 * 24 ))}));

//app.use(casValidate.ticket({'cas_host':'intranet2', 'service':'http://localhost:9000/'}));
app.use(app.router);

if ('development' === app.get('env')) {
	// use livereload middleware
	app.use(require('grunt-contrib-livereload/lib/utils').livereloadSnippet);
	app.use(express.static(path.join(__dirname, '.tmp')));
	app.use(express.static(path.join(__dirname, 'app')));
	app.use(express.errorHandler());
}

var authenticationRequired = function(req, res, next){
	if(req.session !== undefined && req.session.ticket){
		next();
	}
	else{
		res.send(401);
	}
};

//authentification
app.post('/auth/login', function (req, res){
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
});

app.get('/auth/logout', function(req, res){
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
});

//app.get('/auth/logout', casValidate.logout({'cas_host':'intranet2', 'service':'http://localhost:9000/auth/ticket'}));

//menus
app.get('/api/menu/:year/:month/:day', menu.read);
app.post('/api/menu', authenticationRequired, user.isAuthorized('editor'), menu.create);
app.put('/api/menu/:id/add/:idPlat', authenticationRequired, user.isAuthorized('editor'), menu.update);
app.delete('/api/menu/:id/remove/:idPlat', authenticationRequired, user.isAuthorized('editor'), menu.delete);
app.get('/api/menu/:id/plats-non-inclus', authenticationRequired, user.isAuthorized('editor'), menu.platsNonInclus);

//plats
app.get('/api/plat', authenticationRequired, user.isAuthorized('editor'), plat.list);
app.put('/api/plat', authenticationRequired, user.isAuthorized('editor'), plat.create);

//types
app.get('/api/type', authenticationRequired, user.isAuthorized('editor'), type.list);

//users
app.get('/api/user', authenticationRequired, user.isAuthorized('administrator'), user.list);
app.post('/api/user/:id/role/:roleId', authenticationRequired, user.isAuthorized('administrator'), user.changeRole);
app.put('/api/user', authenticationRequired, user.isAuthorized('administrator'), user.create);
app.delete('/api/user/:id', authenticationRequired, user.isAuthorized('administrator'), user.delete);

//roles
app.get('/api/role', authenticationRequired, user.isAuthorized('administrator'), role.list);

module.exports = app;
