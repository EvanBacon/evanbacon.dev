// display this header when admin logs in

Template.adminHeader.helpers({
	isActive: function (type) {
		var name = Router.current().route.getName();
		return (name === type) ? 'active' : '';
	}
});

Template.adminHeader.events({
	'click #navbar-admin li a:not(".dropdown-toggle")': function (e) {
		$('#navbar-admin').collapse('hide');
	}
});