Template.adminHeader.helpers({
	isActive: function (type) {
		var name = Router.current().route.getName();
		return (name === type) ? 'active' : '';
	}
});