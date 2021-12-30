module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      '@expo/html-elements/babel',
      'react-native-reanimated/plugin',
      '@babel/plugin-proposal-export-namespace-from',
      require.resolve('expo-router/babel'),
    ],
  };
};
