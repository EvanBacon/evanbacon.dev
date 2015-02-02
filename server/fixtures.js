Meteor.startup( function() {

	// Fixture for Albums
	if (Albums.find().count() === 0) {
	  Albums._ensureIndex({slug: 1}, {unique: 1});
	}

	// Fixture for Tags, just as examples
	if (Tags.find().count() === 0) {

	  Tags._ensureIndex({name: 1}, {unique: 1});
	  
	  // example tags
	  Tags.insert( 
	    { 
	      name: 'landscapes',
	      slug: 'landscapes' 
	    }
	  );

	  Tags.insert( 
	    { 
	      name: 'nature', 
	      slug: 'nature'
	    }
	  );

	  Tags.insert( 
	    { 
	      name: 'architecture',
	      slug: 'architecture' 
	    }
	  );

	  Tags.insert( 
	    { 
	      name: 'cultural',
	      slug: 'cultural' 
	    }
	  );
	}

	if (Settings.find().count() === 0) {

		Settings.insert({
			"aboutCode" : "<p class=\"text-center\">\nGo to <a href=\"/admin/settings\">settings</a> to add some content here.</p>\n",
			"footerCode" : "<div class=\"home-links\">\n\t\t<a href=\"/albums\">Albums</a> / \n\t\t<a href=\"/about\">About</a> / \n\t\t<a href=\"/contact\">Contact</a> /\n<br>\n</div>",
			"homeDescription" : "Go to <a href=\"/admin/settings\">settings</a> to add some content here.</p>\n",
			"imageMaxSize" : 500000,
			"imageMaxWidth" : 1400,
			"imageWidthLarge" : 800,
			"imageWidthMedium" : 450,
			"imageWidthThumb" : 250,
			"mediaPerPage" : 30,
			"siteDescription" : "An image gallery manager built with Meteor.js"
		});
			
	}
});