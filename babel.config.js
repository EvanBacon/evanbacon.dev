module.exports = function(api) {
  // api.cache(true);
  const isServer = api.caller(caller => caller?.isServer);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // '@expo/html-elements/babel',
      isServer && require('@babel/plugin-transform-dotall-regex'),
    ].filter(Boolean),
  };
};
