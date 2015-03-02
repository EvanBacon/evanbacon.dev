Template.footer.helpers({
	year: function () {
		return (new Date()).getFullYear();
	},
	isAlbum: function () {
		var curr = Router.current().route.getName();
        return curr === 'album';
	},
});