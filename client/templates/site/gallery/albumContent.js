// Display album images

var $container,
	magnificInstance,
	seed,
	oldItems = [],
	loadMore = false,
	refresh = false;

// Initialize magnific popup for images on this page
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
      callbacks:
		{
			/**
			 * Adds custom parameters to markup
			 * For example data-description on <a> can be used as mfp-description in markup html
			 *
			 * @param template
			 * @param values
			 * @param item
			 */
			markupParse: function(template, values, item)
			{
				values.description = item.el.find('.data-caption').html();
			}
		},
      image: {
        tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
		markup: '<div class="mfp-figure">'+
					'<div class="mfp-close"></div>'+
					'<figure>'+
							'<div class="mfp-top-bar">'+
								'<div class="mfp-title"></div>'+
							'</div>'+
						'<div class="mfp-img"></div>'+
						'<figcaption>'+
							'<div class="mfp-bottom-bar">'+
								'<div class="mfp-description"></div>'+
								'<div class="mfp-counter"></div>'+
							'</div>'+
						'</figcaption>'+
					'</figure>'+
				'</div>',
        titleSrc: function(item) {
        	return item.el.find('.data-title').html();
        },
      }
    });
}

var appendItems = function () {

	if (!! Isotope && !! $container.isotope) {
		var elems = [];
		var isoLength = 0,
		    ind = 0;
		
    	isoLength = $container.isotope('getItemElements').length;

		_.each($('.itemPL'), function(item) {
	  	 	if (ind >= isoLength) {
				elems.push(item);
			}
			ind++;  
		});
		 
		// Load images
		$container.imagesLoaded( function() {
		    // Append on isotope      
		    $container.isotope('appended', elems); 
		
		});
		 if (elems.length > 0) {
		 	loadMore = false; 
		 }
				
	} 

}

var createAlbumGrid = function () {
	if (!! Isotope ) {

		$container = $('#album').imagesLoaded( function() {
			$container.isotope({
			    layoutMode:  'packery',
			    itemSelector: '.itemPL',
			    filter:       '*', 
		  	    packery: {
		  	   	   gutter: '.gutter-sizer',
		  	    }
			});
			
		});
	}

};
 
 // Destroy isotope grid (used when moving to a new album/tag page)
resetAlbumGrid = function () {
	try {
		if (!! Isotope && !! $container.isotope)  {
			// superficially create instance in case it doesn't exist
			$container.isotope(); 
			$container.isotope('destroy');
		    $container.isotope = false;

			oldItems = [];
	  		seed.clear();	

	  		refresh = false;

	  	}
	  	
	} catch(e) {

	} 
};

// Initialize the isotope grid (first destroy if on a new album page)
var initAlbumGrid = function () {

	Meteor.defer(function () {
		
	 	if (!loadMore || refresh) {
			resetAlbumGrid();
	    }
	    if (!isTouchDevice()) {
			$('.itemPL').hover(
		        function(){
		            $(this).find('.caption').fadeIn(300); 
		        },
		        function(){
		            $(this).find('.caption').fadeOut(300); 
		        }
		    );
		}
    
		createAlbumGrid(); 
	});
		
	
};

// Tracker for loading more items
Meteor.startup (function () {
	Tracker.autorun(function () {
	  if (Session.get('append-items')) { 
	    Meteor.defer(function() {
	    	appendItems();
			Session.set('append-items', false);
		 });
	  }
	});
});

// function to sort the items by 'weight' 
var orderMedia = function(items, albumId) {
    return _.sortBy(items, function(m) { 
		var weight = 0;
		_.each(m.metadata.albums, function (a) {
			if(a._id === albumId)
				weight = a.weight;
		});
		return weight; 
	});
}

Template.albumContent.created = function () {
	if (RandomShuffle)
		seed = RandomShuffle.seeder();
	 Session.set('append-items', false);
};

Template.albumContent.rendered = function () {
	createMagnificPopup();
};

Template.albumContent.helpers({
	// test if this is supposed to be an album or tag
	isAlbum: function () {
		var curr = Router.current().route.getName();
        return curr === 'album';
	},
	mediaItems: function () {
		var items = [];

		// test if we're on an album page or tag page
		if (Router.current().route.getName() === 'album' && !! this.album) {
			// order the items fetched from the db
			items = orderMedia(this.items.fetch(), this.album._id);

			// if isShuffled is set, then shuffle images
			// TODO: fix the shuffling - currently done on client side
			// Maybe shuffle on server, and shuffle entire list, not just one load at a time
    		if (!! this.album.isShuffled && RandomShuffle ) {
        		seed.set(oldItems.length, this.items.count());
        		if (seed.get().length === items.length)
    		 		items = RandomShuffle.shuffle(items, seed.get()); 
		 	}  	
		} else {
			// it is a tag (not an album), so return associated images
			items = this.items.fetch(); 
		}

		// test if all items have loaded 
		if (items.length === this.count) {	
			// if moving to a new page (reusing template), reinitialize isotope grid
			// else, staying with same album/tag, but loading more items
			if (!loadMore) {
				initAlbumGrid();
			} else {
				Session.set('append-items', true);
			}
			oldItems = items;
		}
	 	
	    return items;
	},
});


Template.albumContent.events({
	// click tag event, filter isotope items
   	'click .filter-btn': function (e) {
   		e.preventDefault();
   		var filterValue = $(e.currentTarget).attr('data-filter');
  		$container.isotope({ filter: filterValue });
  		createMagnificPopup();
   	},
   	// load more photos event
   	'click .load-more': function (e) {
   		$('.filter-btn').removeClass('active');
		$('.filter-btn[data-filter="*"]').addClass('active');
		createMagnificPopup();
		loadMore = true;
   	},
   	// click refresh event - refreshes grid in case it fails to align correctly
   	'click .refresh-album': function (e) {
   		refresh = true;
   		initAlbumGrid();
   	}

});

