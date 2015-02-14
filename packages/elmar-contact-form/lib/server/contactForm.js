
Meteor.methods({
  sendEmail: function(doc) {
    // Important server-side check for security and data integrity
    check(doc, Schema.contact);

    // Build the e-mail text
    var text = "Name: " + doc.name + "\n\n"
            + "Email: " + doc.email + "\n\n\n"
            + doc.message;

    this.unblock();

    var emailTo = getSetting("emailTo");
    
    // Send the e-mail
    Email.send({
        to: emailTo, // send-to e-mail address set in settings 
        from: doc.email,
        subject: "Elmar Creative Contact Form - From " + doc.name,
        text: text
    });
  }
});

