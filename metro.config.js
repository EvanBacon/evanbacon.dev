const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // Enable CSS support.
  isCSSEnabled: true,
});

config.resolver.unstable_enablePackageExports = true;

config.resolver.sourceExts.push('md', 'mdx', 'svg');

config.resolver.assetExts = config.resolver.assetExts.filter(
  ext => !config.resolver.sourceExts.includes(ext)
);

config.transformer.babelTransformerPath = require.resolve('./transformer.js');

module.exports = config;
