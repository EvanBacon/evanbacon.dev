const path = require('path');

const { getDefaultConfig } = require('expo/metro-config');
const tailwind = require('tailwindcss/lib/cli/build');

module.exports = (async () => {
  /** @type {import('expo/metro-config').MetroConfig} */
  const config = getDefaultConfig(__dirname, {
    // Enable CSS support.
    isCSSEnabled: true,
    isSVGEnabled: true,
  });

  config.resolver.sourceExts.push(
    // TODO: Remove mjs in SDK 50
    'mjs',
    'md',
    'mdx',
    'svg'
  );

  config.resolver.assetExts = config.resolver.assetExts.filter(
    ext => !config.resolver.sourceExts.includes(ext)
  );

  config.transformer.babelTransformerPath = require.resolve('./transformer.js');

  // config.resolver.sourceExts.unshift("mjs");
  //   config.resolver.unstable_enablePackageExports = true;

  await tailwind.build({
    '--input': path.relative(__dirname, './global.css'),
    '--output': path.resolve(
      __dirname,
      'node_modules/.cache/expo/tailwind/eval.css'
    ),
    '--watch': process.env.NODE_ENV === 'development' ? 'always' : false,
    '--poll': true,
  });

  return config;
})();
