Template.albumLinks.helpers({
	albums: function () {
		var albums = [];
		_.each(Albums.find().fetch(), function(a) {
			albums.push({'title': a.title, 'slug': a.slug, '_id': a._id});
		});
		return albums;
	},
	isActive: function (type) {
		var slug = Router.current().params.slug;
		return (slug === type) ? 'active' : '';
	}
});	

Template.albumLinks.events({
	'click .album-btn': function (e) {
        e.preventDefault();
        Router.go( 'album', {slug: this.slug});
    },
});