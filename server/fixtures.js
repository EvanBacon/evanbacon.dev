Meteor.startup( function() {

	// Fixture for Works
	if (Works.find().count() === 0) {
	  Works._ensureIndex({slug: 1}, {unique: 1});
	}

	// Fixture for Tags, just as examples
	if (Tags.find().count() === 0) {

	  Tags._ensureIndex({name: 1}, {unique: 1});

	  // example tags
	  Tags.insert(
	    {
	      name: 'landscapes',
	      slug: 'landscapes',
	      usedCount: 0
	    }
	  );

	  Tags.insert(
	    {
	      name: 'architecture',
	      slug: 'architecture',
	      usedCount: 0
	    }
	  );

	  Tags.insert(
	    {
	      name: 'cultural',
	      slug: 'cultural',
	      usedCount: 0
	    }
	  );
	} else {
		// make sure tag usedCount matches actual number of images that use the tag
		var tags = Tags.find({}).fetch();
		_.each(tags, function (t) {
			var used = Media.find({'metadata.tags._id': t._id}).count();
			var counted = t.usedCount;
			if (used !== counted) {
				Tags.update({_id: t._id}, { $set: { usedCount: used }});
				console.log('Deleted ' + t.name + ' tag');
			}
		});
	}

	if (Settings.find().count() === 0) {

		Settings.insert({
			"philosophyCode" : "<p class=\"text-center\">\nGo to <a href=\"/admin/settings\">settings</a> to add some content here.</p>\n",
			"aboutCode" : "<p class=\"text-center\">\nGo to <a href=\"/admin/settings\">settings</a> to add some content here.</p>\n",
			"atelierCode" : "<p class=\"text-center\">\nGo to <a href=\"/admin/settings\">settings</a> to add some content here.</p>\n",
			"footerCode" : "<div class=\"home-links\">\n\t\t<a href=\"/works\">Works</a> / \n\t\t<a href=\"/about\">About</a> / \n\t\t<a href=\"/atelier\">Atelier</a> / \n\t\t<a href=\"/philosophy\">Philosophy</a> / \n\t\t<a href=\"/contact\">Contact</a>\n<br>\n</div>",
			"homeDescription" : "Go to <a href=\"/admin/settings\">settings</a> to add some content here.</p>\n",
			"imageMaxSize" : 500000,
			"imageMaxWidth" : 1400,
			"imageWidthLarge" : 800,
			"imageWidthMedium" : 450,
			"imageWidthThumb" : 250,
			"numberSamplesFromAlbum" : 3,
			"mediaPerPage" : 30,
			"siteDescription" : "An image gallery manager built with Meteor.js"
		});

	}
});
