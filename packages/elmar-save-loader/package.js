Package.describe({
  summary: "Elmar Save Loader package",
  version: '0.0.1',
  name: "elmar-save-loader"
});

Package.onUse(function (api) {

  api.use([
    'underscore',
    'templating'
  ], ['client']);

  api.add_files([
    'lib/client/saving_loader.html',
    'lib/client/saving_loader.js'
  ], ['client']);

  api.export([
    'SaveLoader'
  ]);
});




