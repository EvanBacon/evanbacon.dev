isAdmin=function(user){
	user = (typeof user === 'undefined') ? Meteor.user() : user;
	return !!user; // && !!Roles.userIsInRole(user, ['admin']);
};


