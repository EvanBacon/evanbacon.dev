Meteor.startup(function () {
    // configure MAIL_URL here, or set it as an environmental variable
    // process.env.MAIL_URL = 'smtp://username%40gmail.com:password@smtp.gmail.com:465/';
    process.env.MAIL_URL='smtp://' + process.env.GMAILUSERNAME + '%40gmail.com:' + encodeURIComponent(process.env.GMAILPASSWORD) + '@smtp.gmail.com:465';
});

Meteor.methods({
  sendEmail: function(doc) {
    // Important server-side check for security and data integrity
    check(doc, Schema.contact);

    // Build the e-mail text
    var text = "Name: " + doc.name + "\n\n"
            + "Email: " + doc.email + "\n\n\n\n"
            + doc.message;

    this.unblock();

    // Send the e-mail
    Email.send({
        to: process.env.EMAIL_TO, // send-to e-mail address set as environmental variable 
        from: doc.email,
        subject: "Website Contact Form - Message From " + doc.name,
        text: text
    });
  }
});

