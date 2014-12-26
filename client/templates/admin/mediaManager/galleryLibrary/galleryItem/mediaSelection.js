Template.mediaSelection.helpers ({
  searchQuery: function () {
    var keywords = GetSearch();
    if (keywords)
        return 'Search results for "' + GetSearch() + '"';
  }
});

Template.mediaSelection.events({
    
   'click .thumbnail': function(e) {
        e.preventDefault();
      
        var checked = $('#' + this._id).prop('checked');//document.getElementById(this._id);
        var thumbId = "#tm-" + this._id;
        if($(thumbId).data('checked') === 'checked') {
          $(thumbId).removeClass("selected");
          $(thumbId).data('checked', '');
        } else {
          $(thumbId).addClass("selected");
          $(thumbId).data('checked', 'checked');
        }
    },
    'click .save': function (e) {

    },  
    'click .close, click .close-box': function (e) {
        $('.thumbnail').removeClass("selected");
    }  
}); 
