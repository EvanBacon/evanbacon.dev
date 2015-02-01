// An album group is a sampling of an album
// sampleCount = # random sample images from album
// showTitle = true/false - show the album title box amidst samples

Template.albumGroup.helpers({
	samples: function () {
		var featuredId = _.findWhere(this.content, { isFeatured: 1}).id;
		if (typeof featuredId === undefined || ! featuredId)
			featuredId = this.content[0].id;
		// var media = Media.find({ $and: [{'metadata.albums._id': this._id},
		// 								{ _id: {$ne: featured }} ]} ).fetch();
		var media = Media.find({'metadata.albums._id': this._id}).fetch();

		var featured = _.findWhere(media, { _id: featuredId });
		var count = !! Template.parentData(1).sampleCount ? parseInt(Template.parentData(1).sampleCount) : 2;

		var samples = _.sample(_.without(media, featured), count );

		return _.union(samples, featured);	

	},
	featured: function () {

		var featured = _.findWhere(this.content, { isFeatured: 1});
		if (typeof featured === undefined || ! featured)
			featured = this.content[0];
		return featured;
	},
	count: function () {
	    if (!! this.content)
	      return this.content.length;
	},
	showTitle: function () {
		return typeof Template.parentData(1).showTitle === undefined ? true : Template.parentData(1).showTitle;
	}
});

Template.albumGroup.events({
	'mouseover .album-link': function (e) {
		$('#item-' + Template.parentData(0).slug ).addClass('album-selected');

	},
	'mouseout .album-link': function (e) {
		$('#item-' + Template.parentData(0).slug ).removeClass('album-selected');
	}
});


