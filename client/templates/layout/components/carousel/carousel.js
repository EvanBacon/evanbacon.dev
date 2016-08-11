Template.carousel.rendered = function() {
  $(document).ready(function() {

    // $("#owl-demo").owlCarousel();

    $("#owl-demo").owlCarousel({
        items: 1,
        navigation : true, // Show next and prev buttons
        slideSpeed : 300,
        paginationSpeed : 400,
        singleItem:true

        // "singleItem:true" is a shortcut for:
        // items : 1,
        // itemsDesktop : false,
        // itemsDesktopSmall : false,
        // itemsTablet: false,
        // itemsMobile : false

    });

  });
};

Template.carousel.helpers({
	image: function (slide) {
		//initGrid();
		console.log("atelier",slide);
		return slide.content[0].thumb;
	}
});
