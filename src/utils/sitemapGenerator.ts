import { Product, Category } from '../types';

export function generateSitemapXml(products: Product[], categories: Category[], baseUrl: string = 'https://safwadeals.com'): string {
  const currentDate = new Date().toISOString().split('T')[0];

  const staticPages = [
    { url: `${baseUrl}/`, priority: '1.0', changefreq: 'daily' },
    { url: `${baseUrl}/#/products`, priority: '0.9', changefreq: 'daily' },
    { url: `${baseUrl}/#/categories`, priority: '0.8', changefreq: 'weekly' },
    { url: `${baseUrl}/#/compare`, priority: '0.7', changefreq: 'weekly' },
    { url: `${baseUrl}/#/about`, priority: '0.5', changefreq: 'monthly' },
    { url: `${baseUrl}/#/contact`, priority: '0.5', changefreq: 'monthly' },
    { url: `${baseUrl}/#/privacy`, priority: '0.3', changefreq: 'yearly' },
    { url: `${baseUrl}/#/terms`, priority: '0.3', changefreq: 'yearly' },
    { url: `${baseUrl}/#/affiliate-disclosure`, priority: '0.4', changefreq: 'yearly' }
  ];

  const categoryUrls = categories.map(cat => ({
    url: `${baseUrl}/#/products?category=${encodeURIComponent(cat.id)}`,
    priority: '0.8',
    changefreq: 'weekly'
  }));

  const productUrls = products.map(prod => ({
    url: `${baseUrl}/#/product/${encodeURIComponent(prod.id)}`,
    priority: '0.9',
    changefreq: 'daily'
  }));

  const allUrls = [...staticPages, ...categoryUrls, ...productUrls];

  const urlElements = allUrls.map(item => `  <url>
    <loc>${item.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
}
