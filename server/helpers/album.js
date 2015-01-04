albumFuncs = {
	isSlugUnique: function (albumId, slug) {
		var count = Albums.find({$and: [{_id: { $ne: albumId }}, {'slug': slug} ] }).count();
		return count === 0;
	},
	slugify: function (text) {

	    return text.toString().toLowerCase()
	      .replace(/\s+/g, '-')        // Replace spaces with -
	      .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
	      .replace(/\-\-+/g, '-')      // Replace multiple - with single -
	      .replace(/^-+/, '')          // Trim - from start of text
	      .replace(/-+$/, '');         // Trim - from end of text
	},
	getUniqueSlug: function (albumId, slug) {
		var query = new RegExp( slug, 'i' );
		var slugs = Albums.find({ $and: [{'slug': query}, {_id: { $ne: albumId }} ] }, { $sort: {slug: -1}} ).fetch();
		if (slugs && slugs.length > 0) {

			var unique = true;
			_.each(slugs, function (s) {
				if (s.slug === slug)
					unique = false;
			});
			if ( !unique ) {
				var lastSlug = slugs[slugs.length - 1].slug;
				var nextIndex = slugs.length;
				var slugParts = lastSlug.split('-');
				if (slugParts.length > 1) {
					var index = parseInt(slugParts[slugParts.length - 1]);  // get last index and increment by 1
					if (!Number.isNaN(index))
						nextIndex = index++;
				}
				return slug + '-' + nextIndex;
			}
		} 

		return slug; // slug is already unique
	},

};
