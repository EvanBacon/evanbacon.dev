// Display album images

var $container,
	seed,
	oldItems = [],
	loadMore = false,
	loadCount = 0,
	currentFilter = '*',
	isoOptions = { 
					itemSelector: '.itemPL',
			    	filter:       '*', 
		  	    	masonry: {
						gutter: '.gutter-sizer',
		  	   			columnWidth: '.grid-sizer'
					}
				 };

var appendItems = function () {

	if ( loadCount > 0 ) {
		Meteor.defer(function () {
			var elems = [],
				currElems = [];
			var isoLength = 0,
			    ind = 0;

			$container.imagesLoaded(function () {
				$('.itemPL').removeClass('hidePL');
			    isoLength = $container.isotope('getItemElements').length;
			    
				_.each($('.itemPL'), function(item) {
			  	 	if (ind >= isoLength) {
						elems.push(item);
					} 
					ind++; 
				});
				 
				
				$container.isotope('appended', elems); 
				$container.isotope('layout');
				    
				if (elems.length > 0) { 
					loadMore = false;
					enableCaptions();
				 	if ( currentFilter !== '*' && isAlbum() ) {
					 	$container.isotope({ filter: currentFilter });
				  		initPhotoSwipeFromDOM('.album');
				  	}
				}	
			});
		});
	} 
};

var createAlbumGrid = function () {
	if (typeof Isotope !== 'undefined' && loadCount === 0 ) {

		$container = $('#album'); //.isotope( isoOptions );
		loadCount++;
		Meteor.setTimeout(function () {
		$container.imagesLoaded( function() {
			$('.itemPL').removeClass('hidePL');
		
			
				$container.isotope( isoOptions );
				console.log('init starting');
				// $('.itemPL').removeClass('hidden');
				$container.isotope('layout');
				if ($('.itemPL').length !== $container.isotope('getItemElements').length) {
					// If this is the case, images were not loaded properly and must reload.
					// Seems to be caused by timing issues / race conditions (find better solution for this in future)
					refreshAlbumGrid();
				}
				// immediately load a few more
				$('.load-more').click();
			
		});
		}, 100);
	} else {
		refreshAlbumGrid();
	}

};

var refreshAlbumGrid = function () {
	if (loadCount > 0) {
		$container.isotope('destroy');
		$container = $('#album').isotope( isoOptions );
	}
};
 
 // Destroy isotope grid (used when moving to a new album/tag page)
var resetAlbumGrid = function () {

	    if ( loadCount > 0 ) { 
			// superficially create instance in case it doesn't exist
		    $container.isotope(); 
			$container.isotope('destroy');
			$container.isotope = false;

			oldItems = [];
	  		seed.clear();	

	  		loadMore = false;
	  		loadCount = 0;
	  	}
};

// Initialize the isotope grid (first destroy if on a new album page)
var initAlbumGrid = function () {
	Meteor.defer(function () {
		
	    enableCaptions();
		createAlbumGrid(); 

	});
};

var enableCaptions = function () {
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
};

var registerFilterEvents = function () {
	Meteor.defer(function () {
		// click tag event and filter isotope items
		// register click event here instead of inside Meteor events - can see outside of template this way
		$( ".filter-btn" ).click( function( e ) {
			e.preventDefault();
	   		var filterValue = $(e.currentTarget).attr('data-filter');
	   		currentFilter = filterValue;
	  		$container.isotope({ filter: filterValue });
	  		initPhotoSwipeFromDOM('.album');
		});
	});
};

var isAlbum = function () {
	var curr = Router.current().route.getName();
    return curr === 'album';
};

Template.albumContent.created = function () {
	if (RandomShuffle)
		seed = RandomShuffle.seeder();
};

Template.albumContent.rendered = function () {
	Session.set('album-changed', false);
	initPhotoSwipeFromDOM('.album'); // initialize photoswipe

	// automatically load more on scroll event
	$(window).scroll(function() {
		if($(window).scrollTop() == $(document).height() - $(window).height()) {
	        $('.load-more').click();
	    }
	});

};

Template.albumContent.helpers({
	// test if this is supposed to be an album or tag
	isAlbum: function () {
		return isAlbum();
	},
	mediaItems: function () {
		var items = [];

		if (Session.get('album-changed')) {
	  		resetAlbumGrid();
	  		$('#album').remove('.itemPL'); // remove all previous images from DOM
	  		Session.set('album-changed', false);
	    }

	    // Determine if we're receiving images from current album subscription by checking if titles are the same
	    // If titles are different, then don't return items (wait for subscription to catch up)
	    var title = ''; 
	    if ( isAlbum() ) title = !! this.album && this.album.title;
	    else title = !! this.tag && this.tag.name;

	    if ( title === Session.get('album-title') ) {
	    	items = this.items.fetch(); 

			// test if we're on an album page or tag page
			if ( isAlbum() && !! this.album) {

				// if isShuffled is set, then shuffle images
				// TODO: fix the shuffling - currently done on client side
				// Maybe shuffle on server, and shuffle entire list, not just one load at a time
	    		if (!! this.album.isShuffled && RandomShuffle ) {
	        		seed.set(oldItems.length, this.items.count());
	        		if (seed.get().length === items.length)
	    		 		items = RandomShuffle.shuffle(items, seed.get()); 
			 	}  	
			} 

			// test if all items have loaded 
			if (items.length == this.count && this.ready) {

				// if moving to a new page (reusing template), reinitialize isotope grid
				// else, staying with same album/tag, but loading more items
				if (!loadMore) {
					initAlbumGrid();
				} else {
				    appendItems();
				}

				registerFilterEvents(); // ensure click event for new filter/tag items are registered
				oldItems = items;
			}
		    return items;
		}
	},
});


Template.albumContent.events({
   	// load more photos event
   	'click .load-more': function (e) {
		loadMore = true;

   	},
   	// click refresh event - refreshes grid in case it fails to align correctly
   	'click .refresh-album': function (e) {
   		refreshAlbumGrid();
   	}

});

