Package.describe({
	summary: "Isotope / Masonry Plugin",
	name: "elmar-isotope"
});


Package.on_use(function (api) {
	api.add_files([
		'isotope.pkgd.min.js',
		'isotope.item.js'
	], 'client');

});