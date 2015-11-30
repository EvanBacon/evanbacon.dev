Package.describe({
  summary: "ElMar contact form package",
  version: '0.1.0',
  name: 'elmar-contact-form'
});

Package.onUse(function (api) {


  api.use([
    'templating'
  ], 'client');

  api.use([
    'elmar-lib'
  ], ['client', 'server']);

  api.use([
    'aldeed:autoform',
  ], ['client', 'server']);


  api.addFiles([
    'lib/client/contactForm.html',
    'lib/client/contactForm.js',
    'lib/client/contactForm.css'
    ], ['client']);

  api.addFiles([
    'lib/server/contactForm.js'
    ], ['server']);

  api.addFiles([
    'lib/contactSchema.js',
    'lib/settings.js'
    ], ['client', 'server']);

 
});