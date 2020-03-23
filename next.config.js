// Learn more: https://github.com/expo/expo/blob/master/docs/pages/versions/unversioned/guides/using-nextjs.md#withexpo

const { withExpo } = require('@expo/next-adapter');
const withFonts = require('next-fonts');
const withImages = require('next-images');
const withPlugins = require('next-compose-plugins');
const withVideos = require('next-videos');

module.exports = withPlugins([
  withFonts,
  withImages,
  withVideos,
  [withExpo, { projectRoot: __dirname }],
]);
