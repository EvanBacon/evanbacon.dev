// This template fetches "album groups" for display
// An album group is a sampling of an album
// sampleCount = # random sample images from album
// showTitle = true/false - show the album title box amidst samples
var $isocontainer,
	loadCount = 0,
	isoOptions = { 
					itemSelector: '.itemP',
		  	    	masonry: {
						gutter: '.gutter-sizer',
		  	   			columnWidth: '.grid-sizer'
					}
				 };

var initGrid = function () {
	Meteor.defer(function () {

		if (loadCount > 0) {
			$isocontainer.isotope();
			$isocontainer.isotope('destroy');
			loadCount = 0;
		}

		$isocontainer = $('#albums').isotope( isoOptions );
		loadCount++;
		$isocontainer.imagesLoaded( function() {
			$('.itemP').removeClass('hidden');
			$isocontainer.isotope('layout');
			if ($('.itemP').length !== $isocontainer.isotope('getItemElements').length) {
				// If this is the case, items/images were not loaded properly and must reload.
				// Seems to be caused by timing issues / race conditions (find better solution for this in future)
				refreshGrid();
			}
		});
	
	});
};

var refreshGrid = function () {
	$isocontainer.isotope('destroy');
	$isocontainer = $('#albums').isotope( isoOptions );
};

Template.albumGroupList.helpers({
	items: function () {
		initGrid();
		return Albums.find({});
	}
});