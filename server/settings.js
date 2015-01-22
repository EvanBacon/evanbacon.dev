Meteor.publish('settings', function() {
	return Settings.find({});
});

Settings.allow({
	insert: function (userId) {
		return isAdminById(userId);
	},
	update: function (userId) {
		return isAdminById(userId);
	},
	remove: function (userId) {
		return isAdminById(userId);
	},
});