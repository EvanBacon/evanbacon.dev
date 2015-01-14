

Template.mediaEdit.rendered = function () {
	updateSaveButton('reset');  
};

Template.mediaEdit.helpers({

	isModified: function () {
		return (new Date(this.original.updatedAt) - new Date(this.uploadedAt)) > 0;
	},
	error: function () {
		return Session.get('update-error');
	},
	saveLoader: function () {
		return !! SaveLoader;
	},
	albums: function () {
		return this.metadata.albums;
	}

});

Template.mediaEdit.events({
	'change :input, keyup input, click .close-box, click .close': function (e) {
		updateSaveButton('reset');
	},
	'click .select-button': function (e) {
	 	e.preventDefault();
	 	$('.image-url').select();
	 },
	'click .save': function (e, t) {
		if (!isAdmin()) 
            throw new Meteor.Error(403, 'Permission denied'); 
  
      	updateSaveButton('reset');
		// clearErrors(); // in case user is trying to submit form again


      	var title = t.find(".inputImgTitle").value;
	    var caption = t.find(".inputImgCaption").value;
	    var credit = t.find(".inputImgCredit").value;
	    var currDate = (new Date()).getTime();

	    Media.update({_id: this._id}, 
	    			 { $set: {
	                           "metadata.title": title, 
	                           "metadata.caption": caption,
	                           "metadata.credit": credit, 
	                           "original.updatedAt": currDate
                             }
                     });

	    updateSaveButton('wait');
	 //    try {
		Meteor.call('updateMedia', { 'id': this._id, 'credit': credit } , function (err) { 
		    	if (err) {
		    		console.log(err.reason);
		    		updateSaveButton('error');
		    	} else {
					updateSaveButton('complete');
					// clearErrors();
		    	}
		    	
		    });
		// } catch (err) {
	 //      errorOnSave();
	 //    }

	  }    
});



