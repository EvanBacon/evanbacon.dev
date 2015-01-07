isAdmin=function(user){
	user = (typeof user === 'undefined') ? Meteor.user() : user;
	return !!user;
};

// for publish functions
isAdminById=function(userId){
	var user = Meteor.users.findOne(userId);
	return !!user;
};

