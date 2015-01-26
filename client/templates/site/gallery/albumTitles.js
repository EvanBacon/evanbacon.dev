Template.albumTitles.helpers({
	albums: function () {
		return Albums.find({});
	}
});