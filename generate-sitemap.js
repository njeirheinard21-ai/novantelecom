import fs from 'fs';

const SITE_URL = process.env.VITE_SITE_URL || 'https://novatelecom.cm';
const pages = [
  '/',
  '/search',
  '/wishlist',
  '/category/mac',
  '/category/iphone',
  '/category/ipad',
  '/category/watch',
  '/category/airpods',
  '/info/faq',
  '/info/contact',
  '/info/warranty',
  '/info/services',
  '/info/support',
  '/info/trade-in',
  '/info/repairs',
  '/info/financing',
  '/info/legal'
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map(page => `
  <url>
    <loc>${SITE_URL}${page}</loc>
    <changefreq>daily</changefreq>
    <priority>${page === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('')}
</urlset>`;

fs.writeFileSync('public/sitemap.xml', sitemap);
console.log('Sitemap generated successfully.');
