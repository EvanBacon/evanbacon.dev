// An album group is a sampling of an album
// sampleCount = # random sample images from album
// showTitle = true/false - show the album title box amidst samples

Template.albumGroup.rendered = function() {
	$('.itemP').hover(
        function(){
            $(this).find('.caption').fadeIn(300); 
        },
        function(){
            $(this).find('.caption').fadeOut(300); 
        }
    );
};

Template.albumGroup.helpers({
	samples: function () {
		return Media.find({'metadata.albums._id': this._id}, { limit: getSetting('numberSamplesFromAlbum', 2)}).fetch();
	},
	featured: function () {
		var featured = _.findWhere(this.content, { isFeatured: 1});
		if (typeof featured === undefined || ! featured)
			featured = this.content[0];
		return Media.findOne({_id: featured.id});
	},
	count: function () {
	    if (!! this.content)
	      return this.content.length;
	},
	showTitle: function () {
		return typeof Template.parentData(1).showTitles === undefined ? true : Template.parentData(1).showTitles;
	}
});

Template.albumGroup.events({
	'mouseover .item-album': function (e) {
		$('#item-' + Template.parentData(0).slug ).addClass('album-selected').fadeIn();

	},
	'mouseout .item-album': function (e) {
		$('#item-' + Template.parentData(0).slug ).removeClass('album-selected');
	},
	'click .album-link, click .album-title': function (e) {
        e.preventDefault();
        // resetAlbumGrid();
        // initAlbumGrid();
        Router.go( 'album', {slug: Template.parentData(0).slug});
    },
});


