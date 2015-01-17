Package.describe({
  summary: "ElMar contact form package",
  version: '0.1.0',
  name: 'elmar-contact-form'
});

Package.onUse(function (api) {


  api.use([
    'templating',
    // 'iron:router'
  ], 'client');

  api.use([
    'aldeed:autoform',
  ], ['client', 'server']);


  api.add_files([
    'lib/client/contactForm.html',
    'lib/client/contactForm.js',
    'lib/client/contactForm.css'
    ], ['client']);

  api.add_files([
    'lib/server/contactForm.js'
    ], ['server']);

  api.add_files([
    'lib/contactSchema.js'
    ], ['client', 'server']);

 
});