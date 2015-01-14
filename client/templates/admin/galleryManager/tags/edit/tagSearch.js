Template.tagSearch.helpers({
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
  }
});

var addTag = function (t, id) {
  var tagName = Validation.trimInput(t.find("#searchTag").value);
  if (Validation.isNotEmpty(tagName)) {
    Meteor.call('addTagToMediaList', tagName, Session.get('selected-images'), function (err, result) {
      var error = !! err ? err.message : null;
      Session.set('tag-error', error);
    });
    t.find("#searchTag").value = '';
  }
};

Template.tagSearch.events({
  'click .add-tag': function (e, t) {
      addTag(t);
  },
  'keyup input#searchTag': function (e, t) {
      if (e.which === 13) {
        addTag(t);
      } else {
        if(t.find("#searchTag").value !== "") {
          $(".add-tag").removeClass("btn-default").removeClass("disabled").addClass("btn-primary");
        } else {
          $(".add-tag").removeClass("btn-primary").addClass("btn-default").addClass("disabled");
        }
      }
   }
});




