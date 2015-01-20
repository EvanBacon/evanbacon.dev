Package.describe({
	summary: "Swipebox Plugin",
	name: "elmar-swipebox"
});


Package.on_use(function (api) {
	api.export('Swipebox');
	api.add_files([
		'css/swipebox.min.css',
		'js/jquery.swipebox.min.js',
		'img/loader.gif',
		'img/icons.png',
		'img/icons.svg'
	], 'client');

});