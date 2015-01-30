Meteor.startup(function () {
    // configure MAIL_URL here, or set it as an environmental variable
    var smtp = {
        username: process.env.SMTP_EMAIL,       // eg: username@gmail.com
        password: process.env.SMTP_PASSWORD,          
        server  : process.env.SMTP_SERVER,      // eg: smtp.gmail.com
        port    : process.env.SMTP_PORT         // eg: 465
    }

    if (Validation.isNotEmpty(smtp.username) && Validation.isNotEmpty(smtp.password) && Validation.isNotEmpty(smtp.server) && Validation.isNotEmpty(smtp.port)) {
    
        process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port + '/';

    } else {
        
        console.log('-------------------------------');
        console.log('IMPORTANT: Email setup required');
        console.log('-------------------------------');
        console.log('To enable sending email from this application (forgotten password, contact form etc.), \nplease set the following environmental variables:');
        console.log('\nSMTP_EMAIL - eg: username@gmail.com');
        console.log('SMTP_PASSWORD');
        console.log('SMTP_SERVER - eg: smtp.gmail.com');
        console.log('SMTP_PORT - eg: 465');

    }

    // override email fields
    Accounts.emailTemplates.siteName = getSetting('title');
    Accounts.emailTemplates.from = getSetting('title') + " Admin <" + smtp.username+ ">";

});