// Search and add new or existing tags to a specific media item

Template.tagSearchAdd.helpers({
  settings: function() {
    return {
     position: "top",
     limit: 5,
     rules: [
       {
         collection: Tags,
         field: "name",
         template: Template.tagSearchItem
       }
     ]
    }
  },
  inputId: function () {
    var id = "searchTag";
    if (typeof this.mediaItems !== undefined && !! this.mediaItems ) {
      if ( ! _.isArray(this.mediaItems)) {
        id += this.mediaItems;
      }
    } 
    return id;
  }
});

// get the input id and related media items 
// (if media not passed to this template, it's assumed to be a list of selected media stored in Session)
var getId_Media = function (items) {
  var _id = "#searchTag";
  var _media = [];
  if (typeof items !== undefined && !! items ) {
      _media = [items];
      if ( ! _.isArray(items)) {
            _id += items;
      } else {
        _id = items[0];
      }
  } else {
      _media = Session.get('selected-images');
  }
  return { id: _id, media: _media};
};

var addTag = function (t, items) {

  var obj = getId_Media(items);
  var tagName = Validation.trimInput(t.find(obj.id).value);

  if (Validation.isNotEmpty(tagName)) {
    Meteor.call('addTagToMediaList', tagName, obj.media, function (err, result) {
      var error = !! err ? err.message : null;
      Session.set('tag-error', error);
    });
    t.find(obj.id).value = '';
  }

};

Template.tagSearchAdd.events({
  'click .add-tag': function (e, t) {
      var m = $(e.currentTarget).closest('.input-group').find('.input-tag').attr('data-media');
      addTag(t, m);
      $(e.currentTarget).closest(".input-group").find(".add-tag").removeClass("btn-primary").addClass("btn-default").addClass("disabled");

  },
  'keyup .input-tag': function (e, t) {
        var m = $(e.currentTarget).attr('data-media');

        if (e.which === 13) {
          addTag(t, m);
        } 

        if(t.find(getId_Media(m).id).value !== "") {
          $(e.currentTarget).closest(".input-group").find(".add-tag").removeClass("btn-default").removeClass("disabled").addClass("btn-primary");
        } else {
          $(e.currentTarget).closest(".input-group").find(".add-tag").removeClass("btn-primary").addClass("btn-default").addClass("disabled");
        }

   }
});




