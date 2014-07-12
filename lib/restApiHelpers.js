'use strict';

var helpers = require('./helpers');

module.exports = {
	createRoutsViewer: function(routes) {
		return function(res, req) {
			var result = {};

			routes.forEach(function(layer) {
				if (helpers.isObjectHasOwnProperties(layer, 'route.path') &&
					helpers.isObjectHasOwnProperties(layer, 'route.methods') &&
					layer.route.path.length &&
					Object.keys(layer.route.methods).length) {

					result[layer.route.path] = Object.keys(layer.route.methods);
				}
			});

			req.json({
				error: null,
				result: result
			});
		};
	}
}