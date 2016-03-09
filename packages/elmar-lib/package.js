Package.describe({
  summary: "ElMar library package",
  version: '0.1.0',
  name: "elmar-lib"
});

Package.onUse(function (api) {

  api.use([
    'underscore',
  ], ['client', 'server']);

  // api.add_files([
  //   'lib/server/watermark.js'
  // ], ['server']);

  api.addFiles([
    'lib/lib.js',
    'lib/mediaLibrary.js',
    'lib/validation.js',
    'lib/users.js',
    'lib/base.js',
  ], ['client', 'server']);

  api.addFiles([
    'lib/client/sortAction.js',
    'lib/client/shuffle.js'
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
    'SettingsSchemaAddOns',
    'RandomShuffle',
    'isTouchDevice'

  ]);
});




