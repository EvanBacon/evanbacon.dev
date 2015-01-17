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
		return this.albums;
	}
});