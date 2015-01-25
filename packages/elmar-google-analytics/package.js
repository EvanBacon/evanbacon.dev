Package.describe({
	summary: "Google Analytics package",
	version: '0.1.0',
	name: "elmar-google-analytics"
});

Package.onUse(function (api) {
	api.use([
		'elmar-lib',
		'underscore',
		'iron:router'
	], ['client', 'server']);
	
	api.add_files([
		'lib/settings.js'
	], ['client', 'server']);
	
	api.add_files([
		'lib/googleAnalytics.js',
		'lib/routing.js'
	], ['client']);
});