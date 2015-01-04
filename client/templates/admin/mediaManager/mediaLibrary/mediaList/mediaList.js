Template.mediaList.rendered = function () {
    SortAction.setSortBy( { "uploadedAt": -1 } );    
};

Template.mediaList.helpers({
    isList: function () {
        return getClientSetting('media-list-style') === 'list';
    }
}); 

