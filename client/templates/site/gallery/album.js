var $container,
	magnificInstance,
	loadCount = 0;

var createMagnificPopup = function () {
        magnificInstance = $('#album').magnificPopup({
          delegate: 'a:not(.image-popup-vertical-fit.isotope-hidden)',
          type: 'image',
          tLoading: 'Loading image #%curr%...',
          mainClass: 'mfp-img-mobile',
          gallery: {
            enabled: true,
            navigateByImgClick: true,
            preload: [0,1] // Will preload 0 - before current, and 1 after the current image
          },
          image: {
            tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
            titleSrc: function(item) {
              return item.el.attr('title');
            }
          }
        });
}

var initGrid = function () {
	$('#album').addClass('hidden');
	$('.itemP').addClass('hidden');
	$('.itemP').hover(
        function(){
            $(this).find('.caption').fadeIn(300); 
        },
        function(){
            $(this).find('.caption').fadeOut(300); 
        }
    );
	Meteor.defer(function () {
		if (loadCount > 0 && $container.isotope)  {
			$('#album').isotope().isotope('destroy');
			$container.isotope = false;
			loadCount = 0;
		}

		if (!! Isotope) {
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
			
			$('.itemP').removeClass('hidden');
			$('#album').removeClass('hidden').fadeIn();
		}

	});
};

Template.album.rendered = function () {
	$('.itemP').addClass('hidden');
	initGrid();
	createMagnificPopup();
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
	'click .image-popup-vertical-fit': function (e) {
	  	e.preventDefault();	
		//createMagnificPopup();
   	},
   	'click .filter-btn': function (e) {
   		e.preventDefault();
   		var filterValue = $(e.currentTarget).attr('data-filter');
  		$container.isotope({ filter: filterValue });
  		createMagnificPopup();
   	},
   	'click .load-more': function (e) {
   		$('.filter-btn').removeClass('active');
		$('.filter-btn[data-filter="*"]').addClass('active');
		createMagnificPopup();
   	}
});

