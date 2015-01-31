
Template.tagListForMedia.helpers({
	tags: function () {
		// compile all common tags into an array
		var tags = [];
		// check if a list of media was passed, otherwise check session
		var media = [];
	    if (typeof this.mediaItems !== undefined && !! this.mediaItems ) {
	      	if (! _.isArray(this.mediaItems)) {
	            media = [this.mediaItems];
	        }
	    } else {
	      media = Session.get('selected-images');
	    }
		
		_.each( media, function (mId) {  
			var m = Media.findOne({_id: mId});
			tags.push(m.metadata.tags);
		});

		var tagIds = [];
		_.each(tags, function(arr) {
			tagIds.push(_.pluck(arr, '_id'));
		});

		var common = _.intersection.apply(_, tagIds);

		var result = Tags.find({_id: {$in: common}}).fetch();

		return result;
	},
	media: function () {
		var m = [];
		if ( typeof Template.parentData(1).mediaItems !== undefined ) {
        	m = Template.parentData(1).mediaItems;
	    } 
	    return m;
	}
});

Template.tagListForMedia.events({
  'click .remove-tag': function (e, t) {
      var tagId = $(e.currentTarget).attr('data-tagid');
      var media = $(e.currentTarget).attr('data-media');
      if (! media)
      	media = Session.get('selected-images');
      if (! _.isArray(media))
      	media = [media];

      Meteor.call('removeTagFromMediaList', tagId, media, function (err, result) {
        if (err) console.log(err);
      });
  }
});