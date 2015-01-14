
Template.mediaActions.rendered = function () {
	$('#sortBy').prop('selectedIndex',0);
	$('#sortDir').prop('selectedIndex',0);
	// $('input[type=checkbox] .type-box').prop('checked', true);
	SortAction.setSortBy( {"uploadedAt": -1});
};

Template.mediaActions.events({
    'change select': function (e, t) {
    	var sortObj = new Object;
    	var sortBy = 'copies.image_lg.' + $('#sortBy').val();
    	var sortDir = parseInt( $('#sortDir').val() );

    	sortObj[sortBy] = sortDir;
    	SortAction.setSortBy(sortObj);

    },
    'click .list-style': function (e) {
        setClientSetting('media-list-style', e.currentTarget.id);
    }
});