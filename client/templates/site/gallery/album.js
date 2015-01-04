Template.album.rendered = function () {
	$('#album').justifiedGallery({
	  // option: default,
	  rowHeight: 200,
	  maxRowHeight: 0,
	  lastRow: 'nojustify',
	  fixedHeight: false,
	  captions: true,
	  margins: 3,
	});

	// var $container = $('#gallery').imagesLoaded( function() {
 //  		$container.isotope({
	// 	   itemSelector: '.item',
	//   		masonry: {} 
	// 	  });
	// });
};

Template.album.helpers({
	sortedItems: function () {
		var results = [];

		for(var i = 0; i < this.album.content.length; i++)
			results.push(null);

		var list = _.pluck(this.album.content, "id");
		_.each(Media.find().fetch(), function (m) {
			var index = list.indexOf(m._id);
			results[index] = m;
		});
		return results;
	}
});

Template.album.events({

	'click .swipebox': function (e) {
	  	e.preventDefault();
		$.swipebox({
			useCSS : true, // false will force the use of jQuery for animations
			useSVG : true, // false to force the use of png for buttons
			initialIndexOnArray : 0, // which image index to init when a array is passed
			hideCloseButtonOnMobile : false, // true will hide the close button on mobile devices
			hideBarsDelay : 0, // delay before hiding bars on desktop
			afterOpen: null, // called after opening
			loopAtEnd: false // true will return to the first image after the last image i
		});
  	}
//  'click .fancybox': function(e, t){
	//     link = $(e.currentTarget);
	//     $(this).fancybox({
	//              'autoScale': true,
	//              'type':'iframe',
	//              'height': (typeof link.data('height') == 'undefined' ? link.data('height') : 340),
	//              'width': (typeof link.data('width') == 'undefined' ? link.data('width') : 560),
	//              'href': link.attr('href')
	//         }).click();
	//     return false;
 //  }
});

