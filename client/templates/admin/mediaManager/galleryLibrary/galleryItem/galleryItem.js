Template.galleryItem.helpers ({
  isList: function () {
    return Session.equals('media-list-style', 'list');
  },
});

Template.galleryItem.events({
	'click .destroy': function () {
      if(confirm("Delete gallery?")) {
        delArr = [this._id];
        Galleries.remove({_id: { $in: delArr }});
      }
  	},
   'change input[type=checkbox]': function(e) {
      e.preventDefault();
      var numChecked = SelectionAction.getCheckedCount();
      if(!numChecked) numChecked = 0;
        var checked = $('#' + this._id).prop('checked');
        var thumbId = "#thumb-" + this._id;
        if(checked) {
          $(thumbId).addClass("selected");
          $(thumbId).removeClass("editing");
          SelectionAction.setCheckedCount(++numChecked);
        } else {

          $(thumbId).removeClass("selected");
          if (numChecked > 0) 
            SelectionAction.setCheckedCount(--numChecked);
          else
            SelectionAction.setCheckedCount(0);
        }
    }
});