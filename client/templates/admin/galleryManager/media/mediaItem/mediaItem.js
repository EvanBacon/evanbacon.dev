// Template.mediaItem.rendered = function () {
//     Session.set('is-uploading', 'false');
// }

Template.mediaItem.helpers ({
  isList: function () {
    return getClientSetting('media-list-style') === 'list';
  },
  thumbId: function() {
    return "thumb-" + this._id;
  },
  modalTarget: function() {
    return '#md-' + this._id;
  },
  // tags: function() {
  //   console.log(Template.parentData(1).tags);
  //     return Template.parentData(1).tags;
  // }
  
});

Template.mediaItem.events({
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
    },
    'click .modal-show': function (e, t) {
      // reset form when open modal
      e.preventDefault();

      var self = this;
      $('.inputImgTitle').val(function() {
          return self.metadata.title;
      });
      $('.inputImgCaption').val(function() {
        return self.metadata.caption;
      });
      $('.inputImgCredit').val(function() {
        return self.metadata.credit;
      });
      $('#inputTag').val(function() {
        return '';
      });
      Session.set('selected-images', [this._id]);
    }
});