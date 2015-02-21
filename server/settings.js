Meteor.publish('settings', function() {
    this.unblock(); // don't wait for this publication to finish to proceed
	return Settings.find({});
});