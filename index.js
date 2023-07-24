import 'expo-router/entry';

// Ensure we import the CSS for Tailwind so it's included in hot module reloads.
export const ctx = require.context(
  './node_modules/.cache/expo/tailwind',
  true,
  /\.css$/
);

if (ctx.keys().length) {
  ctx(ctx.keys()[0]);
}
