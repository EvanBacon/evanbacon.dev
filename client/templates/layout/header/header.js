Template.header.helpers({
	isLoggedIn: function () {
		return !! Meteor.user();
	},
	isLoaded: function () {
		return Settings.find().fetch().length > 0;
	}
});