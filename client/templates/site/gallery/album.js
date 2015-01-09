var $container;

var initGrid = function () {
	$('#album').addClass('hidden');
	Meteor.defer(function () {
		if (!typeof $container === undefined )
			$container.isotope('destroy');
		$container = $('#album').imagesLoaded( function() {
			$container.isotope({
			   layoutMode: 'packery',
			   itemSelector: '.item',
		  	   packery: {
		  	   	gutter: '.gutter-sizer',
		  	   columnWidth: '.grid-sizer',
		  	   }
			});
		});
		$('#album').fadeIn().removeClass('hidden');
	});
};

// $('#container').isotope({
//   // options...
//   itemSelector: '.item',
//   masonry: {
//     columnWidth: 200
//   }
// });

// var getItemElement = function(item) {
//   var mdURL = item.url('image_md');
//   var lgURL = item.url('image_lg');
//   var elem = $('<a></a>')//document.createElement('a');
//   var wRand = Math.random();
//   var hRand = Math.random();
//   var widthClass = wRand > 0.85 ? 'w4' : wRand > 0.7 ? 'w2' : '';
//   var heightClass = hRand > 0.85 ? 'h4' : hRand > 0.7 ? 'h2' : '';

//   elem.className = 'swipebox item'; // + widthClass + ' ' + heightClass;
//   elem.attr('href', lgURL);
//   elem.attr('title', item.metadata.title);

//   var image = $('<img>'); //document.createElement('img');
//   image.attr('src', mdURL);
//   image.attr('alt', item.metadata.caption);
//   elem.html(image);

//   return elem;
// }


Template.album.rendered = function () {
	$('#album').addClass('hidden');
	// this.autorun(function(){
	//     //initGrid();
	//     Meteor.defer(function() {
	//     	 console.log('reloading');
	//     	 // if(!! $container) 
	//     	//$container.packery('reloadItems');
	//     	 initGrid();
	    	
	//     });
	   
	//  });



	// $('#album').justifiedGallery({
	//   // option: default,
	//   rowHeight: 200,
	//   maxRowHeight: 0,
	//   lastRow: 'nojustify',
	//   fixedHeight: false,
	//   captions: true,
	//   margins: 3,
	// });

	//initGrid();

	
};

Template.album.helpers({
	sortedItems: function () {
		initGrid();
		return this.items;
		// var results = [];

		// for(var i = 0; i < this.album.content.length; i++)
		// 	results.push(null);

		// var list = _.pluck(this.album.content, "id");
		// _.each(Media.find().fetch(), function (m) {
		// 	var index = list.indexOf(m._id);
		// 	results[index] = m;
		// });
		// return results;
	},
	

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
   	},
   	'click .filter-btn': function (e) {
   		e.preventDefault();
   		var filterValue = $(e.currentTarget).attr('data-filter');
  		$container.isotope({ filter: filterValue });
   	},
   	'click .load-more': function (e) {
   		//e.preventDefault();
   		// $('#album').addClass('hidden');
   		// $container.packery('destroy');
   		//isActive = false;

  //  		var elems = [];
  //  		//var start = Router.current().params.limit || 0;
  //  		var items = Media.find({}, {limit: Router.current().params.limit }).fetch();
  //  		//console.log(items);
  //  		_.each(items, function (i) {
  //  			//console.log(i.metadata.title);
  //  			var elem = getItemElement(i);
  //  			elems.push( elem );
  //  		});
		// // // for ( var i = start; i < this.items.count(); i++ ) {
		// // //     var elem = getItemElement();
		// // //     elems.push( elem );
		// // // }

		// // append elements to container
		// $container.append( elems );
		// // add and lay out newly appended elements
		// $container.packery( 'appended', elems );

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

