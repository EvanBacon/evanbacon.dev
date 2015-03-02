// display cloud of tag links (alternative to clicking on album links)

Template.tagLinks.helpers({
	tags: function () {
		return Tags.find({ usedCount: { $gt: 0 }}, { sort: {name: 1}} );;
	}
});

Template.tagLinks.events({
	'click .tag-link': function (e) {
        e.preventDefault();
        $('.tag-link').removeClass('active');
		$(e.currentTarget).addClass('active');
        Router.go( 'tag', {slug: this.slug});
    },
});