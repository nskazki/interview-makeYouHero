'use strict';

//require
var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var multer = require('multer');

var util = require('util');
var path = require('path');

var Hero = require('./lib/Hero');
var HeroProvider = require('./lib/HeroProvider');
var SimpleConfig = require('./lib/SimpleConfig');
var restApiHelpers = require('./lib/restApiHelpers');

//end require

//var
var heroConfigFile = path.join(__dirname, '/configs/heroConfig');
var heroConfig = new SimpleConfig(heroConfigFile);

var hero = new Hero(heroConfig);

var uploadsDir = path.join(__dirname, '/uploads');
var heroProvider = new HeroProvider(hero, uploadsDir);

var appConfigFile = path.join(__dirname, '/configs/appConfig');
var appConfig = new SimpleConfig(appConfigFile);

var port = appConfig.get('port') || 8000;
var logLevel = appConfig.get('logLevel') || 'dev';

var app = express();

//end var

//logger
app.use(logger(logLevel));

//end logger

//route
app.route('/heroStats')
	.get(heroProvider.getStats.bind(heroProvider))
	.post(bodyParser.json(), heroProvider.setStats.bind(heroProvider));

app.route('/heroImage')
	.get(heroProvider.getHeroImage.bind(heroProvider))
	.post(
		multer({
			dest: heroProvider.uploadsDir,
			limits: {
				fileSize: hero.accessHeroImageSize
			}
		}),
		heroProvider.setHeroImage.bind(heroProvider));

app.route('/')
	.get(restApiHelpers.createRoutsViewer(app._router.stack));

//end route

//error handler
app.use(function(err, req, res, next) {
	res.json(500, {
		error: {
			desc: 'Some unhandled error.',
			error: err.toString()
		}
	});
});

//end error handler

//main
if (!module.parent) {
	
	app.listen(port, function() {
		console.log(util.format('MakeYouHero server listening on port %d', port));
	});

} else {
	module.exports = app;
}

//end main