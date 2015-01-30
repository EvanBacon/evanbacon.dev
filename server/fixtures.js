Meteor.startup( function() {

	// Fixture for Albums
	if (Albums.find().count() === 0) {
	  Albums._ensureIndex({slug: 1}, {unique: 1});
	}

	// Fixture for Tags, just as examples
	if (Tags.find().count() === 0) {

	  Tags._ensureIndex({name: 1}, {unique: 1});
	  
	  
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
});