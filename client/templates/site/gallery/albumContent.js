// Display album images

var $container,
	seed,
	oldItems = [],
	loadMore = false,
	refresh = false,
	currentFilter = '*';


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
		 	if (currentFilter !== '*') {
			 	$container.isotope({ filter: currentFilter });
		  		initPhotoSwipeFromDOM('.album');
		  	}
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
var resetAlbumGrid = function () {
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
	initPhotoSwipeFromDOM('.album');
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
			registerFilterEvents(); // ensure click event for new filter/tag items are registered
			oldItems = items;
		}
	 	
	    return items;
	},
});


Template.albumContent.events({
   	// load more photos event
   	'click .load-more': function (e) {
		initPhotoSwipeFromDOM('.album');
		loadMore = true;
   	},
   	// click refresh event - refreshes grid in case it fails to align correctly
   	'click .refresh-album': function (e) {
   		refresh = true;
   		initAlbumGrid();
   	},

});

