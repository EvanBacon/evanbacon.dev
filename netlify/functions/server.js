const { createRequestHandler } = require('@expo/server/adapter/netlify');

const handler = createRequestHandler({
  build: require('path').join(__dirname, '../../dist'),
  mode: process.env.NODE_ENV,
});

module.exports = { handler };
