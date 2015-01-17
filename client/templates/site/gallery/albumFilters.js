Template.albumFilters.rendered = function () {
	$('.filter-btn').removeClass('active');
	$('.filter-btn[data-filter="*"]').addClass('active');
};

Template.albumFilters.helpers({
	tags: function () {
		// $('.filter-btn').removeClass('active');
		var tags = [];
		_.each(Media.find().fetch(), function(m) {
			_.each(m.metadata.tags, function (t) {
				if(getIndexOf(tags, t._id) < 0) {
					tags.push(t);
				}
			});
		});
		return tags;
	},
});	

Template.albumFilters.events({
	'click .filter-btn': function (e) {
		$('.filter-btn').removeClass('active');
		$(e.currentTarget).addClass('active');
	}
});