Template.tagSearch.helpers({
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

var addTag = function (t, id) {
  var tagName = Validation.trimInput(t.find("#searchTag").value);
  if (Validation.isNotEmpty(tagName)) {
    Meteor.call('addTag', tagName, id, function (err, result) {
      if (err) console.log(err);
    });
    t.find("#searchTag").value = '';
  }
};

Template.tagSearch.events({
  'click .add-tag': function (e, t) {
      addTag(t, this._id);
  },
  'keyup input#searchTag': function (e, t) {
     if(t.find("#searchTag").value !== "") {
        $(".add-tag").removeClass("btn-default").removeClass("disabled").addClass("btn-danger");
     } else {
        $(".add-tag").removeClass("btn-danger").addClass("btn-default").addClass("disabled");
     }
   },
   'submit form': function (e, t) {
     e.preventDefault();
     addTag(t, this._id);
   },
});

Template.currentTags.events({
  'click .remove-tag': function (e, t) {
      var tagId = $(e.currentTarget).attr('data-tagid');
      var mediaId = $(e.currentTarget).attr('data-mediaid');

      Meteor.call('removeTagFromMediaId', tagId, mediaId, function (err, result) {
        if (err) console.log(err);
      });
  }
});



