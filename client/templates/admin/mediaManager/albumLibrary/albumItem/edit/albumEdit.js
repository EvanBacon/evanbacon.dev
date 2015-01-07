var getContentIds = function () {
	// compile a list of already used images so not to display those when selecting new images
	var contentIds = [];
	$.each($('#gridsort li'), function (index, item) {
		contentIds.push($(item).data('contentid'));
	});    
    return contentIds;
};

var isNewAlbum = function (item) {
	// determine if this is a newly created album (this item should be empty if not saved)
	return (typeof item === undefined || item === '');
};

var getName = function () {
	return Router.current().route.getName().replace('Edit', '');
};

Template.albumEdit.helpers({
	isVisible: function () {
		if (typeof this.album._id === undefined) {
			return true;
		}
		return this.album.isVisible === 1;
	},
	isNew: function () {
		// only show cancel button if this is a newly created album (never saved)
		return isNewAlbum(this.album.slug);
	},
	itemType: function (plural, capitalized) {
		text = plural ? 'images' : 'image';
		return capitalized ? capitalizeFirst(text) : text;
	},
	saveText: function () {
		return 'Save ' + capitalizeFirst(getName());;
	}
});

Template.albumEdit.events({
	'change :input, keyup :input': function (e) {
		pageChanged(true);
	},
	'change #inputTitle:input': function (e, t) {
		if(Validation.isNotEmpty(t.find('#inputTitle').value)) {
			$('#inputTitle').closest('.form-group').removeClass('has-error');
			$('#helpTitle').addClass('hidden');
		} else {
			$('#inputTitle').closest('.form-group').addClass('has-error');
			$('#helpTitle').removeClass('hidden');
		}
	},
	'click .add-images': function (e) {
		Session.set('selected-images', getContentIds());
	},
	'click .return-list': function (e) {
		e.preventDefault();
		if( hasPageChanged() || isNewAlbum(this.album.slug) ) {
			if(confirm("Changes will be lost. Would you like to leave this page?")) {
				if (isNewAlbum(this.album.slug)) { 
					Albums.remove({ _id: this.album._id });
				}
				Router.go(getName() + 'Manager');
			}
		} else {
			Router.go(getName() + 'Manager');
		}
		
	},
	'click #save-album': function (e, t) {
		if (!isAdmin()) 
            throw new Meteor.Error(403, 'Permission denied'); 
		var g = {};
	    g.id = this.album._id;
		g.title = Validation.trimInput(t.find('#inputTitle').value);

		g.slug = t.find('#inputSlug').value;
		g.description  = t.find('#inputDesc').value;
		
		g.isVisible = $('#cb-visible').prop('checked') ? 1 : 0;

		var featEl = $('li[data-feat="1"]');

		if ( !featEl.length ) {
			// if no featured image, then set it to first image
			featEl = $('#gridsort li').first();
			setFeatured( featEl );
		}
		g.featured = featEl.data('thumb');
		g.content = getContentData();

	    updateSaveButton('wait');

	    if (Validation.isNotEmpty(g.title)) {
	    	$('#inputTitle').closest('.form-group').removeClass('has-error');
	    	$('#helpTitle').addClass('hidden');
			try {
			  Meteor.call('updateAlbum', g, function (err, id) { 
			    	if (err) {
			    		console.log(err);
			    		updateSaveButton('error');
			    	} else {
			    		updateSaveButton('complete');	
					    pageChanged(false);
			    	}
			    	
			    });
			} catch (err) {
		      updateSaveButton('error');
		    }
		} else {
			updateSaveButton('error');
			$('#inputTitle').closest('.form-group').addClass('has-error');
			$('#helpTitle').removeClass('hidden');
			pageChanged(false);
		}
	}
});

Template.albumEdit.rendered = function () {
	$('[data-toggle="popover"]').popover({
	    trigger: 'hover',
	        'placement': 'right'
	});          
};

