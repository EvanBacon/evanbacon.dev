
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
    },
    'click .destroy' : function (e) {
        e.preventDefault();

        if(confirm("Delete image? ")) {

          Media.remove({ _id: this._id });
          Meteor.call('removeFromAlbums', this._id, function(err) {
                if(err) console.log(err.reason);
          });
        }
    },
    'focusout input.inputImgTitle': function (e, t) {

        var title = t.find(e.currentTarget).value;
        if (title !== this.metadata.title) {
          var id = $(e.currentTarget).attr('data-id');
          Media.update({_id: id}, { $set: {
                               "metadata.title": title, 
                               "original.updatedAt": (new Date()).getTime()
                               }
                       });
          $('.meta-data').removeClass('input-ok');
          $('.inner-addon .glyphicon').addClass('hidden');
          $(e.currentTarget).closest('.inner-addon').find('i').removeClass('hidden');
          $(e.currentTarget).addClass('input-ok');
        } 
        
    },
    'focusout .inputImgCaption': function (e, t) {

        var caption = t.find(e.currentTarget).value;
        if (caption !== this.metadata.caption) {
          var id = $(e.currentTarget).attr('data-id');
          Media.update({_id: id}, { $set: {
                               "metadata.caption": caption, 
                               "original.updatedAt": (new Date()).getTime()
                               }
                       });
          $('.meta-data').removeClass('input-ok');
          $('.inner-addon .glyphicon').addClass('hidden');
          $(e.currentTarget).closest('.inner-addon').find('i').removeClass('hidden');
          $(e.currentTarget).addClass('input-ok');

        } 

    },
    'focusout input.inputImgCredit': function (e, t) {
        var credit = t.find(e.currentTarget).value;
        if (credit !== this.metadata.credit) {
          var id = $(e.currentTarget).attr('data-id');
          Media.update({_id: id}, { $set: {
                               "metadata.credit": credit, 
                               "original.updatedAt": (new Date()).getTime()
                               }
                       });
          $('.meta-data').removeClass('input-ok');
          $('.inner-addon .glyphicon').addClass('hidden');
          $(e.currentTarget).closest('.inner-addon').find('i').removeClass('hidden');
          $(e.currentTarget).addClass('input-ok');
        } 

    },
    'keyup input.meta-data, change .meta-data': function (e, t) {
        e.preventDefault();

        if (e.which === 13) {
          $(e.currentTarget).blur();
        } else {
          $(e.currentTarget).removeClass('input-ok');
          $(e.currentTarget).closest('.inner-addon').find('i').addClass('hidden');
        }      
    },
    
});