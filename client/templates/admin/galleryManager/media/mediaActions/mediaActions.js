
Template.mediaActions.rendered = function () {
	$('#sortBy').prop('selectedIndex',0);
	$('#sortDir').prop('selectedIndex',0);
	SortAction.setSortBy( {"uploadedAt": -1});
    if(getClientSetting('media-list-style')) {
        $('#' + getClientSetting('media-list-style')).addClass('active');
    } else {

        setClientSetting('media-list-style', 'list')
        $('#list').addClass('active');
    }
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
        $('.list-style').removeClass('active');
        $(e.currentTarget).addClass('active');
    }
});