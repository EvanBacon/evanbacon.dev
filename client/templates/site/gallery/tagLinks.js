// display cloud of tag links (alternative to clicking on album links)

Template.tagLinks.helpers({
	tags: function () {
		return Tags.find({});
	}
});

Template.tagLinks.events({
	'click .tag-link': function (e) {
        e.preventDefault();
        Router.go( 'tag', {slug: this.slug});
    },
});