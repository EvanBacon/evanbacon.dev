
IsItemSelected = function (val1, val2) {
	return val1 == val2 ? 'selected' : '';
}

var excludedCategories = function (catId) {

	//  Return all the categories where the current category is a parent 

	var avoidCategories = [];

	if (catId) {
		var children = Categories.find( {'ancestors._id': catId}, { fields: {_id: 1}});
		children.forEach (function (cat) {
			  avoidCategories.push(cat._id);
		});
		avoidCategories.push(catId); // also want to avoid selecting itself as a parent
	}
	return avoidCategories;
};

var excludedPages = function (pageId) {
	
	//  Return all the pages where the current page is a parent 

	var avoidPages = [];

	if (pageId) {
		var children = Posts.find( {'ancestors._id': pageId}, { fields: {_id: 1}});
		children.forEach (function (page) {
			  avoidPages.push(page._id);
		});
		avoidPages.push(pageId); // also want to avoid selecting itself as a parent
	}
	return avoidPages;
};

UI.registerHelper("categorySelect", function (catId) {
	// A category cannot have a parent that is also it's child, so take measures to prevent allowing this selection
	// fetch all non-excluded categories
	var categories = categoryHierarchy(catId);

    var catList = _.map(categories, function(c) {
		return {_id: c._id, name: c.name };
	});
    return catList;
});

UI.registerHelper("pageSelect", function (pageId) {
	// A page cannot have a parent that is also it's child, so take measures to prevent allowing this selection
	// fetch all non-excluded parents
	var pages = pageHierarchy(pageId);
	var pageList = _.map(pages, function(p) {
		return {_id: p._id, title: p.title };
	});
    return pageList;
});

var compareLengths = function (a, b) {
  if (a.num < b.num)
     return -1;
  if (a.num > b.num)
    return 1;
  return 0;
};

var categoryHierarchy = function (catId) {

	var categories;

	var keyword = Session.get("search-category");
    
    var query = new RegExp( keyword, 'i' );
 	var search = { $or: [{'name': query}, {'slug': query}] };

	if(catId) 
		categories = Categories.find({_id: { $nin: excludedCategories(catId) }}, search).fetch();
	else
		categories = Categories.find(search).fetch();

	var orderedList = [];

	var catWithCount = _.map (categories, function (c) {
		var newCat = c;
		newCat.num = (c.ancestors) ? c.ancestors.length : 0;
		newCat.name = Array(newCat.num + 1).join("---") + c.name;
		return newCat;
	});

	catWithCount.sort(compareLengths);

	_.each (catWithCount, function (c) {
		if (!c.parent) {
			orderedList.push(c);
		} else {
			var parentIndex = getIndexOf(orderedList, c.parent);
			if (parentIndex > -1) {
				orderedList.splice(parentIndex + 1, 0, c);
			} else {
				orderedList.push(c);
			}
		}
	});

	return orderedList;
};

var pageHierarchy = function (pageId) {

	var pages;

	if(pageId) {
		pages = Posts.find( { $and: [
										{ _id: { $nin: excludedPages(pageId) }},
										{ type: 'page' }
								    ]
						    },
							{ fields: { _id: 1, title: 1, ancestors: 1, parent: 1} }
						    ).fetch();
	} else {
		pages = Posts.find({ type: 'page' }).fetch();
	}

	var orderedList = [];

	var pageWithCount = _.map (pages, function (p) {
		var newPage = p;

		newPage.num = (p.ancestors) ? p.ancestors.length : 0;
		newPage.title = Array(newPage.num + 1).join("---") + p.title;
		return newPage;
	});

	pageWithCount.sort(compareLengths);

	_.each (pageWithCount, function (p) {
		if (!p.parent || p.parent === '') {
			orderedList.push(p);
		} else {
			var parentIndex = getIndexOf(orderedList, p.parent);
			if (parentIndex > -1) {
				orderedList.splice(parentIndex + 1, 0, p);
			} else {
				orderedList.push(p);
			}
		}
	});

	return orderedList;
};


UI.registerHelper("roleSelect", function (levels) {
	var roles = [];
	var allRoles;
	
	// get all the categories where the current category is a parent
	if (levels) {
		var query = new RegExp( 'level', 'i' );
		allRoles = Meteor.roles.find({ name: query }, { sort: { name: 1} });
	} else {
		allRoles = Meteor.roles.find({}, { sort: { name: 1} });
	}

	allRoles.forEach (function ( role ) {
		roles.push({ _id: role._id, name: role.name, title: role.title });
	});
	return roles;
});