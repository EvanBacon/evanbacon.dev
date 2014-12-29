Package.describe({
  summary: "ElMar library package",
  version: '0.1.0',
  name: "elmar-lib"
});

Package.onUse(function (api) {

  api.use([
    'underscore',
  ], ['client', 'server']);

  api.add_files([
    'lib/server/authorization.js',
  ], ['server']);

  api.add_files([
    'lib/lib.js',
    'lib/medialibrary.js',
    'lib/validation.js',
  ], ['client', 'server']);

  api.add_files([
    'lib/client/sortAction.js',
    ], ['client']);
  
  api.export([
    'getSetting',
    'getSiteUrl',
    'trimWords',
    'capitalize',
    'capitalizeFirst',
    'randomStr',
    'appendToFileName',
    'replaceAll',
    'SortAction',
    'MediaLibrary',
    'Authorize',
    'Validation',
    // 'isAdminById',
    // 'isAdmin',
    // 'MediaLibrary',
    // 'Sorting',
    // 'pageChanged',
    // 'hasPageChanged'
  ]);
});




