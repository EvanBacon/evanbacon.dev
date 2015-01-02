Template.album.rendered = function () {
	$('#gallery').justifiedGallery({
	  // option: default,
	  rowHeight: 200,
	  maxRowHeight: 0,
	  lastRow: 'nojustify',
	  fixedHeight: false,
	  captions: true,
	  margins: 1,
	  randomize: false,
	  extension: /.[^.]+$/,
	  refreshTime: 250,
	  waitThumbnailsLoad: true,
	  justifyThreshold: 0.35,
	  cssAnimation: false,
	  imagesAnimationDuration: 300
	}).on('jg.complete', function (e) {
	  // this callback runs after the gallery layout is created
	}).on('jg.resize', function (e) {
	  // this callback runs after the gallery is resized
	}).on('jq.rowflush', function (e) {
	  // this callback runs when a new row is ready
	});
}