module.exports = function(api) {
  // api.cache(true);
  const isServer = api.caller(caller => caller?.isServer);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['@babel/plugin-proposal-private-methods', { loose: true }],
      // '@expo/html-elements/babel',
      isServer && require('@babel/plugin-transform-dotall-regex'),
    ].filter(Boolean),
  };
};
