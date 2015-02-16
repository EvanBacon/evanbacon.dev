Template.layout.events({
	'click .navbar-admin a, click .header-main a': function (e) {
		if(hasPageChanged()) {
	    	var c = confirm("Changes were made. Are you sure you want to navigate away?");
	    	if (c) {
	     	 pageChanged(false);
	    	} else {
	    		e.preventDefault();
	    	}
	  	} 
	}
});