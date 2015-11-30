Package.describe({
	summary: "Photoswipe Plugin",
	version: '0.1.0',
	name: "elmar-photoswipe"
});


Package.onUse(function (api) {
	api.versionsFrom("METEOR@1.0");
	
	api.use([
    'templating'
  	], 'client');

	api.addFiles([
		'photoswipe.css',
		'default-skin/default-skin.css',
		'photoswipe.min.js',
		'photoswipe-ui-default.min.js',
		'photoswipe.html',
	], 'client');

	api.addAssets([
		'default-skin/default-skin.png',
		'default-skin/default-skin.svg',
		'default-skin/preloader.gif'
	], 'client');
});