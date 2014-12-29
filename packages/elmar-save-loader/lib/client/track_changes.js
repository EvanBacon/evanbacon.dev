pageChanged = function (val) {
	Session.set('page-changed', val);
};

hasPageChanged = function () {
	return Session.get('page-changed');
};

Meteor.startup (function () {
	Tracker.autorun(function () {
	  if (!! hasPageChanged()) {
	  	SaveLoader.saveAction('reset'); 
	  }
	});
});
