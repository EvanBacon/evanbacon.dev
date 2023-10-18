const { resolveConfig, transform } = require('@svgr/core');

async function transformSvg(props) {
  if (props.filename.endsWith('.svg')) {
    // const isNotNative =
    //   !props.options.platform || props.options.platform === 'web';

    const defaultSVGRConfig = {
      // Always set true to ensure we get the same styling options across all platforms.
      native: true,
      // native: !isNotNative,
      plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
      svgoConfig: {
        // TODO: Maybe there's a better config for web?
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                inlineStyles: {
                  onlyMatchedOnce: false,
                },
                removeViewBox: false,
                removeUnknownsAndDefaults: false,
                convertColors: false,
              },
            },
          },
        ],
      },
    };

    const config = await resolveConfig(props.options.projectRoot);
    const svgrConfig = config
      ? { ...defaultSVGRConfig, ...config }
      : defaultSVGRConfig;
    props.src = await transform(props.src, svgrConfig);
  }
}

module.exports.transform = plugins(
  require('@bacons/mdx/metro-transformer').transform,
  transformSvg
);

function plugins(...fns) {
  return async function(props) {
    let nextProps = props;
    for (const fn of fns) {
      const next = await fn(nextProps);
      if (next) {
        nextProps = {
          options: nextProps.options,
          filename: nextProps.filename,
          ...next,
        };
      }
    }

    // Finally pass everything to the upstream transformer.
    return require('@expo/metro-config/babel-transformer').transform(nextProps);
  };
}
