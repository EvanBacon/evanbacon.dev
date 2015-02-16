Meteor.startup( function () {
	var go = Router.go; // cache the original Router.go method
	Router.go = function () {
	  if(hasPageChanged()) {
	    if (confirm("Changes were made. Are you sure you want to navigate away?")) {
	      pageChanged(false);
	      go.apply(this, arguments);
	    }
	  } else {
	    go.apply(this, arguments);
	  }
	};
});