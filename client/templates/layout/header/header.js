Template.header.helpers({
	isActive: function () {
		var name = Router.current().route.getName();
		arguments = _.toArray(arguments);
		return (arguments.indexOf(name) > -1) ? 'active' : '';
	}
});

Template.header.events ({
	'click #navbar li a': function (e) {
		$('#navbar').collapse('hide');
	}
});
