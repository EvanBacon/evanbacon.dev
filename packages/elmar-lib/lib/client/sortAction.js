SortAction = {
	sortByType: function ( type ) {
	    var sortObj = new Object;

	    var sortDir = $('#' + type).attr('class').split(' ')[1];

	    var newClass = (sortDir === 'one') ? 'zero' : 'one';
	    $('#'+type).removeClass(sortDir).addClass(newClass);

	    var sortItem =  type.replaceAll('-', '.').toString(); 
	    sortObj[sortItem] = (sortDir === 'one') ? -1 : 1;

	    //Session.set('sortBy', sortObj);
	    this.setSortBy(sortObj);
	   
	},
	setSortBy: function ( sortBy ) {
		Session.set('sortBy', sortBy )
	},
	getSortBy: function () {
		return Session.get('sortBy');
	}
}