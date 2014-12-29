var getMediaIds = function () {
	// compile a list of already used images so not to display those when selecting new images
	var mediaIds = [];
	$.each($('#gridsort li'), function (index, item) {
		mediaIds.push($(item).data('mediaid'));
	});    
    return mediaIds;
};

var isNewGallery = function (item) {
	// determine if this is a newly created gallery (this item should be empty if not saved)
	return (typeof item === undefined || item === '');
};

Template.galleryEdit.helpers({
	isVisible: function () {
		if (! this.gallery._id) {
			return true;
		}
		return this.gallery.isVisible;
	},
	isNew: function () {
		// only show cancel button if this is a newly created gallery (never saved)
		return isNewGallery(this.gallery.slug);
	},
	saveBtnWidth: function () {
		return isNewGallery(this.gallery.slug) ? 'col-sm-9' : 'col-sm-12';
	},
	cancelBtnWidth: function () {
		return isNewGallery(this.gallery.slug) ? 'col-sm-3' : '';
	}
});

Template.galleryEdit.events({
	'change :input, keyup :input': function (e) {
		pageChanged(true);
	},
	'click .add-images': function (e) {
		Session.set('selected-images', getMediaIds());
	},
	'click #cancel-gallery, click .return-list': function (e) {
		e.preventDefault();
		if (isNewGallery(this.gallery.slug)) {
			if(confirm("Changes will be lost. Would you like to continue?")) {
				Galleries.remove({ _id: this.gallery._id });
			}
		}
		Router.go('galleryManager');
	},
	'click #save-gallery': function (e, t) {
		var g = {};
	    g.id = this.gallery._id;
		g.title = Validation.trimInput(t.find('.inputTitle').value);

		g.slug = t.find('.inputSlug').value;
		g.description  = t.find('.inputDesc').value;
		

		g.isVisible = (e.currentTarget.id === 'save-show') ? 1 : 0;

		var featEl = $('li[data-feat="1"]');
		
		if (!featEl) {
			// if no featured image, then set it to first image
			featEl = $('#gridsort li').first();
			setFeatured( featEl );
			// featEl.data('feat', 1);
		}
		g.featured = featEl.data('thumb');
		g.media = getMediaData();

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

