var $container;
var loadCount = 0;

var initGrid = function () {
	$('.itemP').addClass('hidden');
	$('.itemP').hover(
        function(){
            $(this).find('.caption').slideDown(300); //.fadeIn(250)
        },
        function(){
            $(this).find('.caption').slideUp(300); //.fadeOut(205)
        }
    );
	Meteor.defer(function () {
		if (typeof $container !== undefined && document.readyState === "complete") {
			if (loadCount > 0 && $container.isotope)  {
				$('#album').isotope().isotope('destroy');
				$container.isotope = false;
				loadCount = 0;
			}
		}
		$container = $('#album').imagesLoaded( function() {
			$container.isotope({
			   layoutMode:  'packery',
			   itemSelector: '.itemP',
			   filter:       '*', 
		  	   packery: {
		  	   	gutter: '.gutter-sizer',
		  	    columnWidth: '.grid-sizer',
		  	   }
			});
		});
		loadCount++;
		if ($container.isotope) {
			// $container.isotope('shuffle');
			$container.fadeIn();
		}
		
		$('.itemP').removeClass('hidden');

	});
};

Template.album.rendered = function () {
	$('.itemP').addClass('hidden');
};

Template.album.helpers({
	sortedItems: function () {
		initGrid();

        if (!! this.album.isShuffled ) {
        	return _.shuffle(this.items.fetch());
        } else {
	        var self = this;
		    return _.sortBy(this.items.fetch(), function(m) { 
				var weight = 0;
				_.each(m.metadata.albums, function (a) {
					if(a._id === self.album._id)
						weight = a.weight;
				});
				return weight; 
			});
		}
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
   		$('.filter-btn').removeClass('active');
		$('.filter-btn[data-filter="*"]').addClass('active');
   	}
});

