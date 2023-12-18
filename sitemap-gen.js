#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read all .html files in the dist folder and generate a sitemap from them, write it to both public/sitemap.xml and dist/sitemap.xml
const distPath = path.join(__dirname, './dist/client/_expo/routes.json');

const routes = JSON.parse(fs.readFileSync(distPath, 'utf8'))
  .htmlRoutes.filter(
    ({ generated, routeKeys }) => !generated && !Object.keys(routeKeys).length
  )
  .map(({ page }) => {
    return page
      .replace(/^\.\//, '')
      .replace(/\/index$/, '')
      .split('/')
      .filter(segment => !segment.match(/\(.*\)/))
      .join('/');
  })
  .map(url => {
    const date = new Date().toISOString().split('T')[0];
    return `<url><loc>https://evanbacon.dev/${url}</loc><lastmod>${date}</lastmod></url>`;
  });

const sitemap = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.join(
  '\n'
)}</urlset>`;
fs.writeFileSync(path.join(__dirname, './public/sitemap.xml'), sitemap);
fs.writeFileSync(path.join(__dirname, './dist/sitemap.xml'), sitemap);
