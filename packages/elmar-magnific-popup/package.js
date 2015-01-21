Package.describe({
	summary: "Magnific Popup Plugin",
	name: "elmar-magnific-popup"
});


Package.on_use(function (api) {
	api.add_files([
		'magnific-popup.css',
		'jquery.magnific-popup.min.js',
	], 'client');

});