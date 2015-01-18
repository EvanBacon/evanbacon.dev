
Template.albumGroup.helpers({
	samples: function () {

		var featuredId = _.findWhere(this.content, { isFeatured: 1}).id;
		if (typeof featuredId === undefined || ! featuredId)
			featuredId = this.content[0].id;
		// var media = Media.find({ $and: [{'metadata.albums._id': this._id},
		// 								{ _id: {$ne: featured }} ]} ).fetch();
		var media = Media.find({'metadata.albums._id': this._id}).fetch();

		var featured = _.findWhere(media, { _id: featuredId });

		var samples = _.sample(_.without(media, featured), 2);

		return _.union(samples, featured);	

	},
	featured: function () {

		var featured = _.findWhere(this.content, { isFeatured: 1});
		if (typeof featured === undefined || ! featured)
			featured = this.content[0];
		return featured;
	}
});

Template.albumGroup.events({
	'mouseover .album-link': function (e) {
		$('#item-' + Template.parentData(0).slug ).addClass('selected');

	},
	'mouseout .album-link': function (e) {
		$('#item-' + Template.parentData(0).slug ).removeClass('selected');
	}
});


