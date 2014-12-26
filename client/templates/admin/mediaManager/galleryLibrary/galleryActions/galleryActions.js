Template.galleryActions.rendered = function () {
	Session.set("gallery-list-style", 'thumbnail');
};

Template.galleryActions.events({
    'click .list-style': function (e) {
    	Session.set('gallery-list-style', e.currentTarget.id);
    },
    'click .add-gallery': function (e) {
    	e.preventDefault();
    	e.stopPropagation();
    	Meteor.call('createGallery', function (err, id) { 
			    	if (err) console.log(err);
			    	
			    	if (!! id) {
			    		Router.go( 'galleryEdit', {_id: id} );
			    	}
		});
    }
});