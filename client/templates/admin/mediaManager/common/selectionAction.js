SelectionAction = {
	getCheckedCount: function () {
		return Session.get('count-checked');
	},
	setCheckedCount: function (val) {
		return Session.set('count-checked', val);
	}
}

Template.selectionAction.rendered = function () {
	SelectionAction.setCheckedCount(0);
};

Template.selectionAction.helpers({
   disabled: function () {
   		return (SelectionAction.getCheckedCount() > 0) ? '' : 'disabled';
   },
   btnType: function () {
   		return (SelectionAction.getCheckedCount() > 0) ? 'btn-info' : 'btn-default';
   }

});

Template.selectionAction.events({
	'click #btndelete' : function (e) {
		e.preventDefault();
		if (SelectionAction.getCheckedCount() > 0) {
			if(confirm("Delete selected " + this.name + "?")) {
				var selected = $( "input:checked" );
		
			    _.each(selected, function (item) {
			    	Media.remove({ _id: item.defaultValue });

			    	Meteor.call('removeFromGalleries', item.defaultValue, function(err) {
			            if(err) {
			                console.log(err.reason);
			            } 
			        });
			    });


			    SelectionAction.setCheckedCount(0);
			    
			}
		}
	 },
	 'click #btnclear' : function (e, t) {
		e.preventDefault();
		SelectionAction.setCheckedCount(0); // reset session that keeps track of checkboxes checked
		var selected = $( "input.cb:checked" );
		selected.removeAttr("checked");
		$(".thumb").removeClass("selected"); // remove class from all thumbnails
	 },
	 'click #btncreate' : function (e, t) {
		e.preventDefault();
		e.stopPropagation();
		
		var	images   = [];
		$.each($( "input:checked" ), function (index, item) {
			var thumbURL = $(this).closest('div.thumb').find('img').attr('src');
			images.push( { id: item.defaultValue, thumb: thumbURL, isFeatured: 0 } );
		});
    	Meteor.call('createGallery', images, function (err, id) { 
			    	if (err) console.log(err);
			    	
			    	if (!! id) {
			    		Router.go( 'galleryEdit', {_id: id} );
			    	}
		});
	 }
});