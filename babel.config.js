module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // '@expo/html-elements/babel',
      'react-native-reanimated/plugin',
      'expo-router/babel',
    ],
  };
};
