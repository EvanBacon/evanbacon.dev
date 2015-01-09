Template.tagManager.helpers({
  settings: function() {
    return {
     position: "top",
     limit: 5,
     rules: [
       {
         collection: Tags,
         field: "name",
         template: Template.tagItem
       }
     ]
    }
  }
});

Template.tagManager.events({
  'click .add-tag': function (e, t) {
      var tagName = Validation.trimInput(t.find("#searchTag").value);
      if (Validation.isNotEmpty(tagName)) {
        Meteor.call('addTag', tagName, this._id, function (err, result) {
          if (err) console.log(err);
        });
      }
  },
});

Template.currentTags.events({
  'click .remove-tag': function (e, t) {
      var tagId = $(e.currentTarget).attr('data-tagid');
      var mediaId = $(e.currentTarget).attr('data-mediaid');

      Meteor.call('removeTag', tagId, mediaId, function (err, result) {
        if (err) console.log(err);
      });
  }
});



