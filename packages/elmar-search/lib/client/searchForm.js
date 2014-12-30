
SetSearch = function( query ) {
  Session.set("search-query", query);
};

GetSearch = function () {
  return Session.get("search-query");
};

Template.searchForm.rendered = function () {
  SetSearch('');
};


Template.searchForm.helpers({
  keywords: function () {
    return GetSearch();
  }
});

Template.searchResults.helpers({
  searchQuery: function () {
      var keywords = GetSearch();
      if (keywords)
          return 'Search results for "' + GetSearch() + '"';
  }   
});

Template.searchForm.events({
  'keyup input#searchinput': function (e, t) {
     //if (e.which === 13) 
     SetSearch (t.find("#searchinput").value);
     if(t.find("#searchinput").value === "") {
     	 SetSearch('');
     }
   },
   'submit form': function (e, t) {
     e.preventDefault();
     SetSearch(t.find("#searchinput").value);
   },
   'click #clear-search': function (e, t) {
      SetSearch('');
      t.find("#searchinput").value = "";
   }
});



