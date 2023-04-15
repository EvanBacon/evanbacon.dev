const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push('md', 'mdx', 'svg');

config.resolver.assetExts = config.resolver.assetExts.filter(
  ext => !config.resolver.sourceExts.includes(ext)
);

config.transformer.babelTransformerPath = require.resolve('./transformer.js');

module.exports = config;
