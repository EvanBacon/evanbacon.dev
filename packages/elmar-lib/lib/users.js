isAdminById=function(userId){
	var user = Meteor.users.findOne(userId);
	return !!(user && Roles.userIsInRole(user, ['admin']));
};
isAdmin=function(user){
	user = (typeof user === 'undefined') ? Meteor.user() : user;
	return !!user && !!Roles.userIsInRole(user, ['admin']);
};


