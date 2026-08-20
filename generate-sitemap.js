import fs from 'fs';

const SITE_URL = process.env.VITE_SITE_URL || 'https://novantelecom.cm';
const basePages = [
  '/',
  '/search',
  '/wishlist',
  '/category/mac',
  '/category/iphone',
  '/category/ipad',
  '/category/watch',
  '/category/airpods',
  '/faq',
  '/contact',
  '/warranty',
  '/services',
  '/support',
  '/trade-in',
  '/repairs',
  '/financing',
  '/legal'
];

const locales = ['en', 'fr'];
const pages = ['/']; // The root redirect page
locales.forEach(locale => {
  basePages.forEach(page => {
    pages.push(`/${locale}${page === '/' ? '' : page}`);
  });
});

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map(page => `
  <url>
    <loc>${SITE_URL}${page}</loc>
    <changefreq>daily</changefreq>
    <priority>${page === '/' || page === '/en' || page === '/fr' ? '1.0' : '0.8'}</priority>
  </url>`).join('')}
</urlset>`;

fs.writeFileSync('public/sitemap.xml', sitemap);
console.log('Sitemap generated successfully.');
