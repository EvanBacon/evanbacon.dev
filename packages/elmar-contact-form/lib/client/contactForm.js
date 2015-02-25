AutoForm.hooks({
  contactForm: {
    onSuccess: function(operation, result, template) {
      $('.submit-buttons').addClass('hidden');
      $('.submit-success').removeClass('hidden');
      $('.submit-error').addClass('hidden');
    },
    onError: function(operation, error, template) {
      $('.submit-error').removeClass('hidden');
    }
  }
});

Template.contactForm.helpers({
  contactFormSchema: function() {
    return Schema.contact;
  }
});
