
Template.tagListFromMedia.helpers({
	tags: function () {
		// compile all common tags into an array
		var tags = [];
		_.each(Session.get('selected-images'), function (mId) {
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
	}
});

Template.tagListFromMedia.events({
  'click .remove-tag': function (e, t) {
      var tagId = $(e.currentTarget).attr('data-tagid');

      Meteor.call('removeTagFromMediaList', tagId, Session.get('selected-images'), function (err, result) {
        if (err) console.log(err);
      });
  }
});