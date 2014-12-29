Template.galleryEdit.helpers({
	isVisible: function () {
		if (! this.gallery._id) {
			return true;
		}
		return this.gallery.isVisible;
	},
	isNew: function () {
		// only show cancel button if this is a newly created gallery (never saved)
		return typeof this.gallery.slug === undefined || this.gallery.slug === '';
	},
	saveBtnWidth: function () {
		return (typeof this.gallery.slug === undefined || this.gallery.slug === '') ? 'col-sm-9' : 'col-sm-12';
	},
	cancelBtnWidth: function () {
		return (typeof this.gallery.slug === undefined || this.gallery.slug === '') ? 'col-sm-3' : '';
	}
});

var getMediaIds = function () {
	var mediaIds = [];
	$.each($('.sortable li'), function (index, item) {
		mediaIds.push($(item).data('mediaid'));
	});    
    return mediaIds;
};

Template.galleryEdit.events({
	'change :input': function (e) {
		pageChanged(true);
		updateSaveButton('reset');
	},
	'click .add-images': function (e) {
		pageChanged(true);
		Session.set('selected-images', getMediaIds());
	},
	'click #cancel-gallery': function (e) {
		e.preventDefault();
		if(confirm("Changes will be lost. Would you like to continue?")) {
			Galleries.remove({ _id: this.gallery._id });
			Router.go('galleryManager');
		}
	},
	'click #save-gallery': function (e, t) {
		updateSaveButton('reset');
		
		var g = {};
	    g.id = this.gallery._id;
		g.title = Validation.trimInput(t.find('.inputTitle').value);

		g.slug = t.find('.inputSlug').value;
		g.description  = t.find('.inputDesc').value;
		

		g.isVisible = (e.currentTarget.id === 'save-show') ? 1 : 0;
		g.media = getMediaData();

		var featEl = $('li[data-feat="1"]');
		g.featured = featEl.data('thumb');

	    updateSaveButton('wait');

	    if (Validation.isNotEmpty(g.title)) {
			try {
			  Meteor.call('updateGallery', g, function (err, id) { 
			    	if (err) {
			    		console.log(err);
			    		//throwError(err.reason);
			    		updateSaveButton('error');
			    	} else {
			    		updateSaveButton('complete');	
					    //clearErrors();
					    pageChanged(false);
			    	}
			    	
			    });
			} catch (err) {
		      updateSaveButton('error');
		    }
		} else {
			updateSaveButton('error');
		}

	}
});

Template.galleryEdit.rendered = function () {
	$('[data-toggle="popover"]').popover({
	    trigger: 'hover',
	        'placement': 'left'
	});          
};

