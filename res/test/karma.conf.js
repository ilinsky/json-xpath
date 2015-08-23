module.exports = function (options) {
	'use strict';

	options.set({
		basePath: '../../',
		autoWatch: true,
		singleRun: false,
		browsers: [
			'PhantomJS'
		],
		frameworks: [
			'mocha'
		],
		plugins: [
			'karma-mocha',
			'karma-coverage',
			'karma-chrome-launcher',
			'karma-phantomjs-launcher'
		],
		files: [
			'node_modules/expect.js/expect.js',
			'test/testSpec.js'
		]
	});
};