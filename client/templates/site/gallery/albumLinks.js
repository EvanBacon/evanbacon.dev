// displays album links

Template.albumLinks.helpers({
	works: function () {
		var works = [];
		_.each(Works.find({isPerson: {$in: [null, 0]}}).fetch(), function(a) {
			works.push({'title': a.title, 'slug': a.slug, '_id': a._id});
		});
		return works.slice(0,4);
	},
	isActive: function (type) {
		var slug = Router.current().params.slug;

		// if this is an album (not a tag), then highlight active album link
		if (Router.current().route.getName() === 'album')
			return (slug === type) ? 'active' : '';
	}
});

Template.albumLinks.events({
	'click .album-btn': function (e) {
        $('.filter-btn').removeClass('active'); // need to reset tag selection
		$('.filter-btn[data-filter="*"]').addClass('active');
    },
});
