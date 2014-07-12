var Hero = require('../lib/Hero');
var SimpleConfig = require('../lib/SimpleConfig');
var HeroProvider = require('../lib/HeroProvider');
var request = require('supertest');
var app = require('..');

var assert = require('assert');
var path = require('path');
var fs = require('fs');

//SimpleConfig
describe('SimpleConfig', function() {
	var configFile = path.join(__dirname, 'testBlankConfig.json');
	var simpleConfig = null;

	fs.writeFileSync(configFile, '{}');
	simpleConfig = new SimpleConfig(configFile);

	var blank = {
		field: 'firstField'
	};

	it('write to config', function() {
		simpleConfig.set('blank', blank);
		assert.deepEqual(simpleConfig.get('blank'), blank);
	});

	it('read from config', function() {
		assert.deepEqual(simpleConfig.get('blank'), blank);
	});
});

//end SimpleConfig

//Hero
describe('Hero', function() {
	var stats = {
		name: "Mort",
		strength: 6,
		dexterity: 9,
		intellect: 7,
		isInvincible: false
	};
	var heroImage = path.join(__dirname, 'image.png');
	var imageSize = 1024 * 1024 * 2;
	var imageExt = ['.png'];

	var configFile = path.join(__dirname, 'testHeroConfig.json');
	var simpleConfig = null;

	fs.writeFileSync(configFile, '{}');
	simpleConfig = new SimpleConfig(configFile);

	it('init all fields', function() {
		var hero = new Hero(stats, heroImage, simpleConfig, imageSize, imageExt);

		assert.deepEqual(hero.getStats(), stats);
		assert.equal(hero.getHeroImage(), heroImage);
	});

	it('init wrong access image size', function() {
		var toSmallSize = 1024 * 2;

		var hero = new Hero(stats, heroImage, simpleConfig, toSmallSize);

		assert.equal(hero.getHeroImage(), null);
	});

	it('init wrong access image formats', function() {
		var wrongFormats = ['.txt', '.pdf'];

		var hero = new Hero(stats, heroImage, simpleConfig, imageSize, wrongFormats);

		assert.equal(hero.getHeroImage(), null);
	});

	it('init wrong stats', function() {
		var wrongStats = {
			name: null,
			strength: 'very strength',
			dexterity: false,
			intellect: 0.7,
			isInvincible: 0
		};

		var hero = new Hero(wrongStats, heroImage);
		assert.equal(hero.getStats(), null);
	})

	it('init from config', function() {
		var hero = new Hero(simpleConfig);

		assert.deepEqual(hero.getStats(), stats);
		assert.equal(hero.getHeroImage(), heroImage);
	});
});

//end Hero

//HeroProvider
describe('HeroProvider', function() {
	var heroImage = path.join(__dirname, 'image.png');
	var stats = {
		name: "Mort",
		strength: 6,
		dexterity: 9,
		intellect: 7,
		isInvincible: false
	};

	it('POST /heroImage', function(done) {
		request(app)
			.post('/heroImage')
			.attach('avatar', heroImage)
			.expect('Content-Type', /json/)
			.expect(200, done);
	});

	it('GET /heroImage', function(done) {
		request(app)
			.get('/heroImage')
			.expect('Content-Type', /image/)
			.expect(200, done);
	});

	it('POST /heroStats', function(done) {
		request(app)
			.post('/heroStats')
			.send(stats)
			.expect('Content-Type', /json/)
			.expect(200, done);
	});

	it('GET /heroStats', function(done) {
		request(app)
			.get('/heroStats')
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err);
				assert.deepEqual(stats, res.body.result);
				done();
			});
	});
});

//end HeroProvider