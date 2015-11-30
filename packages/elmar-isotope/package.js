Package.describe({
	summary: "Isotope / Masonry Plugin",
	name: "elmar-isotope"
});


Package.onUse(function (api) {
	api.addFiles([
		'isotope.pkgd.min.js',
		'isotope.item.js'
	], 'client');

});