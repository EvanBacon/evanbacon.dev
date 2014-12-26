pageChanged = function (val) {
	Session.set('page-changed', val);
};

hasPageChanged = function () {
	return Session.get('page-changed');
};