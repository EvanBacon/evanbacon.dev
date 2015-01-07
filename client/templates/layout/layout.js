// justifyGrid = function () {
//     $('#album').justifiedGallery({
//       // option: default,
//       rowHeight: 200,
//       maxRowHeight: 0,
//       lastRow: 'nojustify',
//       fixedHeight: false,
//       captions: true,
//       margins: 3,
//       captionSettings: { animationDuration: 500,
//             visibleOpacity: 0.8,
//             nonVisibleOpacity: 0.6
//       }
//     }); 
// };

Template.layout.rendered = function () {
	// $('.thumbnail').hover(
 //        function(){
 //            $(this).find('.caption').slideDown(250); //.fadeIn(250)
 //        },
 //        function(){
 //            $(this).find('.caption').slideUp(250); //.fadeOut(205)
 //        }
 //    );
};

// Template.layout.events({
// 	'keyup input#searchinput': function (e) {
// 	    if (e.which === 8) {
// 	    	//justifyGrid();
// 	    }
//    },
//    'click #clear-search': function (e) {
//         //justifyGrid();
//    }
// });