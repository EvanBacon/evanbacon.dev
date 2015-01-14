var addTag = function(t) {
	var tagName = Validation.trimInput(t.find(".inputTagName").value);
  	if (Validation.isNotEmpty(tagName)) {
	    Meteor.call('addNewTag', tagName, function (err) {
	      var error = !! err ? err.message : null;
        Session.set('tag-error', error);
	    });
    	t.find(".inputTagName").value = '';
 	 }
};

var disableAdd = function () {
	$(".add-tag").removeClass("btn-danger").addClass("btn-default").addClass("disabled");
};

var enableAdd = function () {
	$(".add-tag").removeClass("btn-default").removeClass("disabled").addClass("btn-danger");
};

Template.tagAdd.events({
  'click .add-tag': function (e, t) {
      addTag(t);
      disableAdd();
  },
  'keyup input.inputTagName': function (e, t) {
     if (e.which === 13) {
     	addTag(t);
     }
     if(t.find(".inputTagName").value !== "") {
     	enableAdd();
     } else {
     	disableAdd();
     }
   },
});