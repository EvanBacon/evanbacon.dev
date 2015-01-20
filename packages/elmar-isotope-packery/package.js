Package.describe({
	summary: "Isotope / Packery Libraries",
	name: "elmar-isotope-packery"
});


Package.on_use(function (api) {
	api.add_files([
		'isotope.pkgd.js',
		'packery.pkgd.js',
		'isotope.item.js'
	], 'client');

});