#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read all .html files in the dist folder and generate a sitemap from them, write it to both public/sitemap.xml and dist/sitemap.xml
const distPath = path.join(__dirname, './dist');

function collectForDir(dir, parent = '') {
  const files = fs.readdirSync(dir);

  let lines = files
    .filter(
      file =>
        file.endsWith('.html') &&
        file !== '[...404].html' &&
        file !== '_sitemap.html' &&
        !file.match(/\(.*\)/) &&
        !file.match(/\[.*\]/)
    )
    .map(file => {
      const url = `https://evanbacon.dev/${path
        .join(parent, file)
        .replace(/(index)?\.html/, '')}`.replace(/\/$/, '');
      // Formatted as `2022-01-01`
      const date = new Date().toISOString().split('T')[0];
      return `<url><loc>${url}</loc><lastmod>${date}</lastmod></url>`;
    });

  // recurse into subdirectories

  for (const file of files) {
    if (
      fs.statSync(path.join(dir, file)).isDirectory() &&
      !file.match(/\(.*\)/) &&
      !file.match(/\[.*\]/)
    ) {
      lines = lines.concat(
        collectForDir(path.join(dir, file), path.join(parent, file))
      );
    }
  }

  return lines;
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${collectForDir(
  distPath
).join('\n')}</urlset>`;
fs.writeFileSync(path.join(__dirname, './public/sitemap.xml'), sitemap);
fs.writeFileSync(path.join(__dirname, './dist/sitemap.xml'), sitemap);
