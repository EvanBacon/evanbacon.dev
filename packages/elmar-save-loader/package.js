Package.describe({
  summary: "Elmar Save Loader package",
  version: '0.1.0',
  name: "elmar-save-loader"
});

Package.onUse(function (api) {

  api.use([
    'underscore',
    'templating'
  ], ['client']);

  api.addFiles([
    'lib/client/saving_loader.css',
    'lib/client/saving_loader.html',
    'lib/client/saving_loader.js',
    'lib/client/track_changes.js'
  ], ['client']);

  api.export([
    'SaveLoader',
    'pageChanged',
    'hasPageChanged'
  ]);
});




