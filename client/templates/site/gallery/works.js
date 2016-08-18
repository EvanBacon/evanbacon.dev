Template.works.helpers({
	items: function () {
    console.log(Works.find({isPerson: {$in: [null, 0]}}), "Works");
		return Works.find({isPerson: {$in: [null, 0]}});
	}
});
