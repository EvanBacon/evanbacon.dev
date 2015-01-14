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

  ], ['server']);

  api.add_files([
    'lib/lib.js',
    'lib/medialibrary.js',
    'lib/validation.js',
    'lib/users.js',
    'lib/base.js'
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
    'getIndexOf',
    'SortAction',
    'MediaLibrary',
    'Validation',
    'isAdmin',
    'isAdminById',
    'SettingsSchemaAddOns'

  ]);
});




