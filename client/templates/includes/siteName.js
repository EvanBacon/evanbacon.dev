Template.siteName.helpers({
	home: function () {
		var name = Router.current().route.getName();
		return name === 'home';
	}
});