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
	secure = require('./routes/secure'),
	path = require('path'),
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
var sessionStore = new MongoStore({url: 'mongodb://localhost/sso-sessions'});
app.use(express.errorHandler({ dumpExceptions : true, showStack : true}));
app.use(express.cookieParser());
app.use(express.session({	store : sessionStore,
							secret : 'allez on y croit cette fois',
							key : 'menu-du-jour',
							maxAge : new Date(Date.now() + (3600000 * 24)),
							expires : new Date(Date.now() + (3600000 * 24 ))}));

//app.use(casValidate.ticket({'cas_host':'intranet2', 'service':'http://localhost:9000/'}));
app.use(app.router);
console.log(app.get('env'));
if ('development' === app.get('env')) {
	// use livereload middleware
	app.use(require('grunt-contrib-livereload/lib/utils').livereloadSnippet);
	app.use(express.static(path.join(__dirname, '.tmp')));
	app.use(express.static(path.join(__dirname, 'app')));
	app.use(express.errorHandler());
}
if ('production' === app.get('env')) {
	app.use(express.static(path.join(__dirname, 'dist')));
	app.use(express.errorHandler());
}



//authentification
app.post('/auth/login', secure.login);
app.get('/auth/logout', secure.logout);

//menus
app.get('/api/menu/:year/:month/:day', menu.read);
app.post('/api/menu', secure.authenticationRequired, user.isAuthorized('editor'), menu.create);
app.put('/api/menu/:id/add/:idPlat', secure.authenticationRequired, user.isAuthorized('editor'), menu.update);
app.delete('/api/menu/:id/remove/:idPlat', secure.authenticationRequired, user.isAuthorized('editor'), menu.delete);
app.get('/api/menu/:id/plats-non-inclus', secure.authenticationRequired, user.isAuthorized('editor'), menu.platsNonInclus);

//plats
app.get('/api/plat', secure.authenticationRequired, user.isAuthorized('editor'), plat.list);
app.put('/api/plat', secure.authenticationRequired, user.isAuthorized('editor'), plat.create);

//types
app.get('/api/type', secure.authenticationRequired, user.isAuthorized('editor'), type.list);

//users
app.get('/api/user', secure.authenticationRequired, user.isAuthorized('administrator'), user.list);
app.post('/api/user/:id/role/:roleId', secure.authenticationRequired, user.isAuthorized('administrator'), user.changeRole);
app.put('/api/user', secure.authenticationRequired, user.isAuthorized('administrator'), user.create);
app.delete('/api/user/:id', secure.authenticationRequired, user.isAuthorized('administrator'), user.delete);

//roles
app.get('/api/role', secure.authenticationRequired, user.isAuthorized('administrator'), role.list);

module.exports = app;
