Template.header.helpers({
	isLoggedIn: function () {
		return !! Meteor.user();
	}
});