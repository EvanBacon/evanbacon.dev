Template.tagActions.rendered = function () {
	$('#sortBy').prop('selectedIndex',0);
	$('#sortDir').prop('selectedIndex',0);
	SortAction.setSortBy( {"name": 1});
};

Template.tagActions.events({
    'change select': function (e, t) {
    	var sortObj = new Object;
    	var sortBy = $('#sortBy').val();
    	var sortDir = parseInt( $('#sortDir').val() );

    	sortObj[sortBy] = sortDir;
    	SortAction.setSortBy(sortObj);
    }
});