AutoForm.hooks({
  contactForm: {
    onSuccess: function(operation, result, template) {
      $('.submit-buttons').addClass('hidden');
      $('.submit-success').removeClass('hidden');
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

Template.contactForm.events({
  'click .btn-reset': function (e) {
     $('.submit-error').addClass('hidden');
     $('.submit-success').addClass('hidden');
  }
});
