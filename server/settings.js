Meteor.publish('settings', function() {
	return Settings.find({});
});