var maximumColumns = 6;
var blockMargin = 5;


var blockDimensions = function () {
	var maxWidth = $(".gridsort").width();
	var size = Math.floor( (maxWidth / maximumColumns) - (widgetMargin * 2) );
	return {
		width: size,
		height: size
	}
}

var gridsort = null;

var getBlockHTML = function (id, featured, thumb) {
	var btnFeat = ( featured === 1 ) ? 'btn-danger' : 'btn-default';
	var html =  '<li class="ui-state-default" data-mediaid="' + id + '" data-feat="' + featured + '" data-thumb="' + thumb + '">' +
            			'<header><div class="btn-toolbar">' + 
							'<button type="button" title="Set as Featured Image" class="btn btn-sm ' + btnFeat + ' set-featured">' +
								'<span class="glyphicon glyphicon-star"></span></button>' +
		        			'<button type="button" title="Remove" class="btn btn-sm btn-default delete-block">' +
			        			'<span class="glyphicon glyphicon-trash"></span></button>' +
		  					'</div>' +
		 				'</header>' +
						'<div class="block-content" >' +
            				'<img src="' + thumb + '">' + 
            		    '</div>' +
        				'</li>';

    return html;
};


initGridSort = function (media) {
	$('#gridsort').empty();

	_.each(media, function(m) {
		addMedia(m.id, m.isFeatured, m.thumb);
    });
    
};

addMedia = function (id, isFeatured, thumb) {
	var html = getBlockHTML(id, isFeatured, thumb);
	$('#gridsort').append(html);
};

getMediaData = function () {
	var media = [];
	$.each($('#gridsort li'), function (index, item) {
		media.push({ 'id': $(item).data('mediaid'), 'thumb': $(item).data('thumb'), 'isFeatured': $(item).data('feat') });
	});
	return media;
};	

setFeatured = function (obj) {
	$('li').attr('data-feat', '0'); // make all non-featured
	$('.set-featured').removeClass('btn-danger'); // remove btn class for featured
	
	obj.find('.set-featured').addClass('btn-danger');
	obj.attr('data-feat', '1');
};



Template.gridSort.rendered = function () {
	$('#gridsort').sortable({
		placeholder: "highlight",
	});
	$('#gridsort').disableSelection();

	if (!! this.data.mediadata) {
		initGridSort(this.data.mediadata);
	}
 
};

Template.gridSort.events({
	'click .set-featured': function (e) {
		e.preventDefault();
		pageChanged( true );
		setFeatured( $(e.currentTarget).closest('li') );
	}, 
	'click .delete-block': function (e) {
		e.preventDefault();
		pageChanged(true);
		$('#gridsort').remove($(e.currentTarget).closest("li"));
	},
});	




