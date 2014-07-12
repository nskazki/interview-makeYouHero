'use strict';

module.exports = {
	is: function(value, type) {
		switch (type) {
			case 'int':
				return this.isInteger(value);
			case 'string':
				return this.isString(value);
			case 'boolean':
				return this.isBoolean(value);
			case 'object':
				return this.isObject(value);
			case '*':
				return true;
		}
	},

	isBoolean: function(value) {
		return (value === true) || (value === false);
	},

	isString: function(value) {
		return (value && value.toString() === value) && value.length;
	},

	isInteger: function(value) {
		return Math.floor(value) === value;
	},

	isObject: function(value) {
		return (value !== null) && (typeof value === 'object');
	},

	isObjectHasOwnProperties: function(value, propsPath) {
		if (this.isObject(value) && this.isString(propsPath)) {

			var link = value;
			return propsPath.split('.').every(function(prop) {
				if (link.hasOwnProperty(prop)) {
					link = link[prop];
					return true;
				} else return false;
			});

		} else return false;

	}
};