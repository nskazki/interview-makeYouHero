'use strict';

//require
var path = require('path');
var helpers = require('./helpers');

//end require

//module
module.exports = HeroProvider;

//end module

function HeroProvider(hero, uploadsDir) {
	this.hero = hero;
	this.uploadsDir = uploadsDir;
}

//stats
HeroProvider.prototype.setStats = function(req, res) {
	if (this.hero.setStats(req.body)) {
		res.json({
			error: null,
		});
	} else {
		res.json(400, {
			error: {
				desc: "incorrect stats.",
				statsPattern: this.hero.statsPattern,
				youRequest: req.body
			}
		});
	}
};

HeroProvider.prototype.getStats = function(req, res) {
	var stats = this.hero.getStats();

	if (stats) {
		res.send({
			error: null,
			result: stats
		});
	} else {
		res.send(503, {
			error: {
				desc: "stats not set."
			}
		});
	}
};

//end stats

//image
HeroProvider.prototype.setHeroImage = function(req, res) {
	if (
		helpers.isObjectHasOwnProperties(req, 'files.avatar.truncated') &&
		helpers.isObjectHasOwnProperties(req, 'files.avatar.name') &&
		!req.files.avatar.truncated &&
		this.hero.setHeroImage(path.join(this.uploadsDir, req.files.avatar.name))
	) {

		res.json({
			error: null
		});
	} else {
		res.json(400, {
			error: {
				desc: "heroImage upload error.",
				imageFieldName: 'avatar',
				accessHeroImageFormats: this.hero.accessHeroImageFormats,
				accessHeroImageSize: this.hero.accessHeroImageSize,
				youRequest: req.files
			}
		});
	}
};

HeroProvider.prototype.getHeroImage = function(req, res) {
	var filePath = this.hero.getHeroImage();

	if (filePath) {
		res.sendfile(filePath);
	} else {
		res.json(503, {
			error: {
				desc: 'heroImage not set.'
			}
		});
	}
};

//end image