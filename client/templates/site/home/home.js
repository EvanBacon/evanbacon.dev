
Template.home.events({
	'click .jump-to-album': function(e) {
		e.preventDefault();

        $("html, body").animate({ scrollTop: 600 }, 600);
    	return false;

	}  
});