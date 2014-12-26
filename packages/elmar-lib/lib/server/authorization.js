// Helper functions for authorization
Authorize = {
	// authors: function (userId) {
	// 	if(!userId) {
	// 		userId = Meteor.user();
	// 	}
	// 	return userId && Roles.userIsInRole(userId, [
	// 		'author',
	// 		'admin'
	// 	]);
	// },
	admins: function (userId) {
		if(!userId) {
			userId = Meteor.user();
		}
		//return userId && Roles.userIsInRole(userId, ['admin']);
		return !! userId;
	}
};
	