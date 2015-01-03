Package.describe({
	summary: "Gamma Gallery",
	name: "elmar-gamma-gallery"
});


Package.on_use(function (api) {
	api.use([
    'jquery'
    ], 'client');

	api.add_files([
		'js/modernizr.custom.70736.js',
		'js/jquery.masonry.min.js',
		'js/jquery.history.js',
		'js/js-url.min.js',
		'js/jquerypp.custom.js',
		'js/gamma.js', 
		'css/demo.css',
		'css/style.css',
	], 'client');

	
});