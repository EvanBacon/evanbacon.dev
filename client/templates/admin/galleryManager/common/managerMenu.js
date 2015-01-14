Template.managerMenu.helpers({
	isActive: function (type) {
		var name = Router.current().route.getName();
		return (name === type) ? 'active bold' : 'dim';
	}
});