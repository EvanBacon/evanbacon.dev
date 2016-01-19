// one-time registration form for main user of application

AutoForm.hooks({
  regForm: {
    onSuccess: function(operation, result) {
      Router.go('atSignIn');
    },
    onError: function(operation, error) {
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
