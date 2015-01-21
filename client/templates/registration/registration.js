AutoForm.hooks({
  regForm: {
    onSuccess: function(operation, result, template) {
      var email = template.find('#inputEmail').value
        , password = template.find('#inputPassword').value;

      Meteor.loginWithPassword(email, password, function(err){
        if (err)
          console.log(err.reason);
      });
    },
    onError: function(operation, error, template) {
      $('.submit-error').removeClass('hidden');
      $('.submit-error h4').html(error);
    }
  }
});

Template.registration.helpers({
  registrationSchema: function() {
    return registrationSchema;
  }
});

Template.registration.events({
  'click .btn-reset': function (e) {
     $('.submit-error').addClass('hidden');
  }
});
