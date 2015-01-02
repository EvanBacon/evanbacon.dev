Template.album.rendered = function () {
	$('#gallery').justifiedGallery({
	  // option: default,
	  rowHeight: 200,
	  maxRowHeight: 0,
	  lastRow: 'nojustify',
	  fixedHeight: false,
	  captions: true,
	  margins: 3,
	});
};

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

