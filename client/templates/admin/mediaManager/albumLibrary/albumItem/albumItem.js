Template.albumItem.helpers({
  count: function () {
    return this.content.length;
  },
  thumbId: function() {
    return "thumb-" + this._id;
  },
  isAdminSide: function() {
    return isAdmin() && Router.current().route.getName() === 'albumManager';
  }
});

Template.albumItem.events({
	  'change input[type=checkbox]': function(e) {
      e.preventDefault();
      var numChecked = SelectionAction.getCheckedCount();
      if(!numChecked) numChecked = 0;
        var checked = $('#' + this._id).prop('checked');
        var thumbId = "#thumb-" + this._id;
        if(checked) {
          $(thumbId).addClass("selected");
          SelectionAction.setCheckedCount(++numChecked);
        } else {

          $(thumbId).removeClass("selected");
          if (numChecked > 0) 
            SelectionAction.setCheckedCount(--numChecked);
          else
            SelectionAction.setCheckedCount(0);
        }
    },
    'click .album-link': function (e) {
        e.preventDefault();
        var curr = Router.current().route.getName(),
            routeTo = 'album';
        if (curr === 'albumManager') {
          routeTo = 'albumEdit';
        } 
        Router.go( routeTo, {_id: this._id});
    }
});