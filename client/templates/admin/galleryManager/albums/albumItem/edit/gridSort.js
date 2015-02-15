var gridsort = null;

var getBlockHTML = function (id, featured, thumb) {
	var btnFeat = ( featured === 1 ) ? 'btn-danger' : 'btn-default';
	var html =  '<li class="ui-state-default" data-contentid="' + id + '" data-feat="' + featured + '" data-thumb="' + thumb + '">' +
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

var updatePosition = function (){
    $('#gridsort li').each(function(i){
        $(this).html(i + 1);
    });
};

initGridSort = function (content) {
	$('#gridsort').empty();

	_.each(content, function(c) {
		addContent(c.id, c.isFeatured, c.thumb);
    });
    
};

addContent = function (id, isFeatured, thumb) {
	var html = getBlockHTML(id, isFeatured, thumb);
	$('#gridsort').append(html);
};

getContentData = function () {
	var content = [];
	$.each($('#gridsort li'), function (index, item) {
		content.push({ 'id': $(item).data('contentid'), 'thumb': $(item).data('thumb'), 'isFeatured': $(item).data('feat') });
	});
	return content;
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

	if (!! this.data.contentdata) {
		initGridSort(this.data.contentdata);
	}

	$('#gridsort').on( 'remove', 'li', updatePosition );
 
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
		$(e.currentTarget).closest("li").remove();
	},
});	




