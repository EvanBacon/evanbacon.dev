const { resolveConfig, transform } = require('@svgr/core');
const upstreamTransformer = require('@expo/metro-config/babel-transformer');
const MdxTransformer = require('@bacons/mdx/metro-transformer');

// MDX v3 no longer passes the meta string from fenced code blocks (e.g. ```jsx app.js)
// as a prop. This remark plugin preserves it as `metastring` on the code element.
function remarkCodeMeta() {
  return async tree => {
    const { visit } = await import('unist-util-visit');
    visit(tree, 'code', node => {
      if (node.meta) {
        node.data = node.data || {};
        node.data.hProperties = node.data.hProperties || {};
        node.data.hProperties.metastring = node.meta;
      }
    });
  };
}

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
const remarkMdxFrontmatter = require('remark-mdx-frontmatter').default;
const remarkGfm = require('remark-gfm').default;
const rehypeSlug = require('rehype-slug').default;
const rehypeAutolinkHeadings = require('rehype-autolink-headings').default;

const mdxTransformer = MdxTransformer.createTransformer({
  remarkPlugins: [remarkGfm, remarkCodeMeta, [remarkMdxFrontmatter, { name: 'meta' }]],
  rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]],
});

module.exports.transform = plugins(mdxTransformer.transform, transformSvg);

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
    return upstreamTransformer.transform(nextProps);
  };
}
