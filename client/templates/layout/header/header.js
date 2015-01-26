Template.header.helpers({
	isLoaded: function () {
		return Settings.find().fetch().length > 0;
	}
});

Template.header.rendered = function () {
	$('[data-toggle=offcanvas]').click(function() {
  		$(this).toggleClass('visible-xs text-left');
    	$(this).find('i').toggleClass('glyphicon-align-justify glyphicon-chevron-left');
	    $('.row-offcanvas').toggleClass('active');
	    $('#lg-menu').toggleClass('hidden-xs').toggleClass('visible-xs');
	    $('#album-list').toggleClass('hidden-xs').toggleClass('visible-xs');
	    $('#xs-menu').toggleClass('hidden-xs').toggleClass('visible-xs');
	    $('#sidebar-footer').toggleClass('hidden-xs').toggleClass('visible-xs');
	    $('#logo').toggleClass('hidden-xs').toggleClass('visible-xs');
	    $('#title').toggleClass('visible-xs').toggleClass('hidden-xs');
	    $('#btnShow').toggle();
    });
};