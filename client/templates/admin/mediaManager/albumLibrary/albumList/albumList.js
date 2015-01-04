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
//     }).on('jg.complete', function (e) {

//     });  
// };

Template.albumList.rendered = function () {
    // SortAction.setSortBy( null );
    justifyGrid();
};

// Template.albumList.helpers({
//     isList: function () {
//         return Session.equals('album-list-style', 'list');
//     }
// }); 

