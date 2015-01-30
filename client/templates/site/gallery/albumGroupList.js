// This template fetches "album groups" for display
// An album group is a sampling of an album
// sampleCount = # random sample images from album
// showTitle = true/false - show the album title box amidst samples
var $container;
var initGrid = function () {
	Meteor.defer(function () {
		$container = $('#album').imagesLoaded( function() {
			$container.isotope({
			   layoutMode: 'packery',
			   itemSelector: '.itemP',
		  	   packery: {
		  	   	gutter: '.gutter-sizer',
		  	    columnWidth: '.grid-sizer',
		  	   }
			});
		});
	});
};

Template.albumGroupList.helpers({
	items: function () {
		initGrid();
		return Albums.find({});
	},
	home: function () {
		var name = Router.current().route.getName();
		return name === 'home';
	}
});