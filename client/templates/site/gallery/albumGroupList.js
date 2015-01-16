var $container;
var loadCount = 0;

var initGrid = function () {
	//$('#album').addClass('hidden');
	//$('.item img').addClass('hidden');
	Meteor.defer(function () {
		if (typeof $container !== undefined && document.readyState === "complete" && loadCount > 0)  {
			// console.log($container);
			$container.isotope('destroy');
			loadCount = 0;
		}
		// if (loadedCount = 0) {
		$container = $('#album').imagesLoaded( function() {
			$container.isotope({
			   layoutMode: 'packery',
			   itemSelector: '.itemP',
		  	   packery: {
		  	   	gutter: '.gutter-sizer',
		  	    columnWidth: '.grid-sizer',
		  	    isHorizontal: false
		  	   }
			});
		});
		loadCount++;

		// }
		//$('.item img').removeClass('hidden');
		//$('#album').fadeIn().removeClass('hidden');
	});
};

Template.albumGroupList.helpers({
	items: function () {
		initGrid();

		return this.albums;

		
	}
});