// maximumColumns = 6;
// widgetMargin = 5;


// var widgetDimensions = function () {
// 	var maxWidth = $(".gridster").width();
// 	var size = Math.floor( (maxWidth / maximumColumns) - (widgetMargin * 2) );
// 	return {
// 		width: size,
// 		height: size
// 	}
// }

// gridster = null;

// getWidgetHTML = function (id, featured, url) {
// 	var btnFeat = ( featured === '1' ) ? 'btn-danger' : 'btn-default';
// 	var html = '<li data-mediaid="' + id + '" data-feat="' + featured + '" data-url="' + url + '">' +
//             			'<header><div class="btn-toolbar">' + 
// 							'<button type="button" title="Set as Featured Image" class="btn btn-sm ' + btnFeat + ' set-featured">' +
// 								'<span class="glyphicon glyphicon-star"></span></button>' +
// 		        			'<button type="button" title="Remove" class="btn btn-sm btn-default delete-block">' +
// 			        			'<span class="glyphicon glyphicon-trash"></span></button>' +
// 		  					'</div>' +
// 		 				'</header>' +
// 						'<div class="block-content" >' +
//             				'<img src="' + url + '">' +
//         				'</div></li>';
//     return html;
// };

// initGridster = function (serialization) {
// 	// sort serialization
//     serialization = Gridster.sort_by_row_and_col_asc(serialization);
// 	gridster.remove_all_widgets();

//     _.each(serialization, function(s) {
//     	var html = getWidgetHTML(s.id, s.isFeatured, s.url);
//         gridster.add_widget(html, s.size_x, s.size_y);
//     });

// 	// $('#grid-blocks').empty();

//  //    Blaze.renderWithData(Template.galleryGrid, $("#grid-blocks")[0], document.getElementById("grid-blocks")); 

// };

// initGridsterWithMedia = function (media) {
	
// 	gridster.remove_all_widgets();

//     _.each(media, function(m) {
//     	var html = getWidgetHTML(m.id, '0', m.thumb);
//         gridster.add_widget(html, 1, 1);
//     });

// 	// $('#grid-blocks').empty();

//  //    Blaze.renderWithData(Template.galleryGrid, $("#grid-blocks")[0], document.getElementById("grid-blocks")); 

// };



// Template.galleryGrid.rendered = function (){

// 	dimensions = widgetDimensions();
// 	widgetHeight = dimensions.height;

// 	gridster = $(".gridster ul").gridster({
//           widget_base_dimensions: [dimensions.width, dimensions.height],
//           widget_margins: [widgetMargin, widgetMargin],
//           max_cols: maximumColumns,
// 		  min_cols: maximumColumns,
// 		  serialize_params: function($w, wgd) {
// 		  	return {
// 		  		id: $($w).attr('data-mediaid'),
// 		  		isFeatured: $($w).attr('data-feat'),
// 		  		url: $($w).attr('data-url'),
// 		  		size_x: wgd.size_x,
// 		  		size_y: wgd.size_y,
// 		  		col: wgd.col,
// 		  		row: wgd.row
// 		  	};
// 		  },
//           // helper: 'clone',
//           resize: {
//             enabled: false
//           },
//           draggable: {
//          	 // stop: function(e, ui, $widget) {
// 	         	// updateSerialization();
//            // 	 }	
// 	      },

//         }).data('gridster');


// 	if (!! this.data.serialdata) {
// 		initGridster(this.data.serialdata);
// 	} else if (!! this.data.mediadata) {
// 		initGridsterWithMedia(this.data.mediadata);
// 	}

	
// };	




