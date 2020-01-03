// Learn more: https://github.com/expo/expo/blob/master/docs/pages/versions/unversioned/guides/using-nextjs.md#withexpo

const { withExpo } = require('@expo/next-adapter')
const withFonts = require('next-fonts')
const withImages = require('next-images')
const withTM = require('next-transpile-modules')
const withPlugins = require('next-compose-plugins')

module.exports = withPlugins(
  [
    // [
    //   withTM,
    //   {
    //     transpileModules: ['...'],
    //   },
    // ],
    withFonts,
    withImages,
    [withExpo, { projectRoot: __dirname }],
  ],
  {
    // ...
  }
)
