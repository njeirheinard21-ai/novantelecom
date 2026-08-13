import fs from 'fs';
const SITE_URL = process.env.VITE_SITE_URL || 'https://einortsolutions.com';
fs.writeFileSync('public/sitemap.xml', '<urlset><url><loc>' + SITE_URL + '/</loc></url><!-- SITE_URL --></urlset>');
