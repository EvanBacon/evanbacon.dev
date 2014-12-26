Template.galleryActions.events({
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