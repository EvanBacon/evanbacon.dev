Template.atelier.helpers({
	items: function () {
		//initGrid();
		console.log("atelier",Works.find({}));
		return Works.find({});
	}
});
