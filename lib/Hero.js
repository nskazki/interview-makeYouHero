'use strict';

//require
var helpers = require('./helpers');
var SimpleConfig = require('./SimpleConfig');

var fs = require('fs');
var path = require('path');

//end require

//module
module.exports = Hero;

//end module

function Hero(stats, heroImage, simpleConfig, accessHeroImageSize, accessHeroImageFormats) {
	this.stats = null;
	this.heroImage = null;

	if (!arguments.length) return this;

	if (arguments[0] instanceof SimpleConfig) {
		simpleConfig = arguments[0];

		accessHeroImageSize = arguments[1];
		accessHeroImageFormats = arguments[2];

		stats = simpleConfig.get('stats');
		heroImage = simpleConfig.get('heroImage');
	}

	this.simpleConfig = simpleConfig;

	this.accessHeroImageSize = accessHeroImageSize || 1024 * 1024;
	this.accessHeroImageFormats = accessHeroImageFormats || ['.png', '.jpg'];

	this.setStats(stats);
	this.setHeroImage(heroImage);
};

//stats
Hero.prototype.checkStats = function(stats) {
	return (
		helpers.isObject(stats) &&
		Object.keys(this.statsPattern).every(function(key) {
			var type = this.statsPattern[key];

			return helpers.is(stats[key], type);
		}.bind(this))
	);
};

Hero.prototype.statsPattern = {
	name: 'string',
	strength: 'int',
	dexterity: 'int',
	intellect: 'int',
	isInvincible: 'boolean'
};

Hero.prototype.setStats = function(stats) {
	var isChecked = this.checkStats(stats);

	if (isChecked) {
		this.stats = stats;
		this.saveToConfig('stats', this.stats);
	}

	return isChecked;
};

Hero.prototype.getStats = function() {
	return this.stats;
};

//end stats

//heroImage
Hero.prototype.chechHeroImage = function(heroImage) {
	try {
		var imageStat = fs.statSync(heroImage);

		return imageStat.isFile() &&
			(imageStat.size <= this.accessHeroImageSize) &&
			(this.accessHeroImageFormats.indexOf(path.extname(heroImage)) != -1);

	} catch (ex) {
		return false;
	}
};

Hero.prototype.setHeroImage = function(heroImage) {
	var isChecked = this.chechHeroImage(heroImage);

	if (isChecked) {
		this.heroImage = heroImage;
		this.saveToConfig('heroImage', this.heroImage);
	}

	return isChecked;
};

Hero.prototype.getHeroImage = function(heroImage) {
	return this.heroImage;
};

//end heroImage

//save to simpleConfig
Hero.prototype.saveToConfig = function(key, value) {
	if (this.simpleConfig) this.simpleConfig.set(key, value);
};

//end save to simpleConfig