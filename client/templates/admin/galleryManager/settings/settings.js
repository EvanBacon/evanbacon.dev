AutoForm.hooks({
  updateSettingsForm: {

    before: {
      update: function(docId, modifier, template) {
      	updateSaveButton('wait');
        return modifier;
      }
    },

    onSuccess: function(operation, result, template) {
        updateSaveButton('complete');
    },

    onError: function(operation, result, template) {
    	updateSaveButton('error');
    }

  },
  insertSettingsForm: {

    before: {
      insert: function(doc, template) {
        updateSaveButton('wait');
        return doc;
      }
    },

    onSuccess: function(operation, result, template) {
		updateSaveButton('complete')	
    },

    onError: function(operation, result, template) {
    	updateSaveButton('error');
    }

  }
});

Template.settings.events({
	'change :input, keyup :input': function () {
		pageChanged(true);
	}
});