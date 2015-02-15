Template.albumItem.helpers({
  count: function () {
    if (!! this.content)
      return this.content.length;
  },
  visibleIcon: function () {
    return this.isVisible === 1 ? 'glyphicon-eye-open' : 'glyphicon-eye-close';
  },
  visibleBtn: function () {
    return this.isVisible === 1 ? 'btn-success' : 'btn-default';
  }
});

Template.albumItem.events({
	  'change input[type=checkbox]': function(e) {
      e.preventDefault();
      var numChecked = SelectionAction.getCheckedCount();
      if(!numChecked) numChecked = 0;
        var checked = $('#' + this._id).prop('checked');

      if(checked) {
        SelectionAction.setCheckedCount(++numChecked);
      } else {

      if (numChecked > 0) 
          SelectionAction.setCheckedCount(--numChecked);
      else
          SelectionAction.setCheckedCount(0);
      }
    },
    'dblclick .block-content, click .album-link': function (e) {
        e.preventDefault();
        var curr = Router.current().route.getName(),
            routeTo = 'album';
        if (curr === 'albumManager') {
          routeTo = 'albumEdit';
          Router.go( routeTo, {_id: this._id});
        } else {
          Router.go( routeTo, {slug: this.slug});
        }
    },
    'click .toggle-display': function (e) {
        e.preventDefault();
        Meteor.call('toggleAlbumVisibility', this._id, function (err) { 
            if (err) console.log(err);
        });
        
    }
});