
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
        e.preventDefault();
        Session.set('selected-images', [this._id]);
    },
    'click .destroy' : function (e) {
        e.preventDefault();

        if(confirm("Delete image? ")) {
          // first test if image checkbox is selected
          var selected = $("#thumb-" + this._id);

          if (selected.hasClass("selected")) {
            var checkmark = $( "#" + this._id );
            checkmark.removeAttr("checked");
          
            var countSelect = SelectionAction.getCheckedCount();
            if (countSelect > 0) {
              // reset session that keeps track of checkboxes checked
              SelectionAction.setCheckedCount(--countSelect); 
            }
            // remove selected class from thumbnail
            selected.removeClass("selected"); 
          }   


          var media = Media.findOne({_id: this._id});
          var tags = [];
          if (!! media.metadata.tags) {
            tags =_.pluck(media.metadata.tags, '_id');
          }
          
          Media.remove({ _id: this._id });
          Meteor.call('removeFromAlbums', this._id, function(err) {
              if(err) console.log(err.reason);
          });
          // decrement use count of any tags used by this media item
          if (!! tags) {
              Meteor.call('decrementTags', tags, function(err) {
                  if(err) console.log(err.reason);
              });
          }


        }
    },
    'focusout input.inputImgTitle': function (e, t) {

        var title = t.find(e.currentTarget).value;
        if (title !== this.metadata.title) {
          var id = $(e.currentTarget).attr('data-id');
          console.log(id);
          if (!! id) {
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
        } 
        
    },
    'focusout .inputImgCaption': function (e, t) {

        var caption = t.find(e.currentTarget).value;
        if (caption !== this.metadata.caption) {
          var id = $(e.currentTarget).attr('data-id');
          if (!! id) {
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

        } 

    },
    'focusout input.inputImgCredit': function (e, t) {
      
        var credit = t.find(e.currentTarget).value;
        if (credit !== this.metadata.credit) {
          var id = $(e.currentTarget).attr('data-id');
          if (!! id) {
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
        } 

    },
    'keyup input.meta-data, change .meta-data': function (e, t) {
        e.preventDefault();
        var id = $(e.currentTarget).attr('data-id');
        if (!! id) {
          if (e.which === 13) {
            $(e.currentTarget).blur();
          } else {
            $(e.currentTarget).removeClass('input-ok');
            $(e.currentTarget).closest('.inner-addon').find('i').addClass('hidden');
          }     
        } 
    },
    
});