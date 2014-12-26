Package.describe({
	summary: "Gridster.js",
	name: "elmar-gridsterjs"
});

Package.on_use(function (api, where) {
	api.add_files(['jquery.gridster.with-extras.min.js', 'jquery.gridster.min.css'], 'client');
});