'use strict';

//require
var fs = require('fs');
var path = require('path');

var nconf = require('nconf');

//end require

//module
module.exports = SimpleConfig;

//end module

var count = 0;

function SimpleConfig(filePath) {
	this.id = count++;
	this._setFilePath(filePath);
	this.nconf = nconf.file(this.id, this.filePath);
};

//public
SimpleConfig.prototype.get = function(path) {
	return this.nconf.stores[this.id].get(path);
};

SimpleConfig.prototype.set = function(key, value) {
	this.nconf.stores[this.id].set(key, value);
	this.nconf.stores[this.id].save(null, function() {});
};

//end public

//private
SimpleConfig.prototype._confixExt = '.json';

SimpleConfig.prototype._setFilePath = function(filePath) {
	if (path.extname(filePath) != this._confixExt) filePath += this._confixExt;
	this.filePath = filePath;
}

//end private