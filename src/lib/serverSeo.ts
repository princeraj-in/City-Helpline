import { ROUTE_SEO_CONFIG, getSeoForPath, BASE_APP_URL } from './seoConfig.ts';

/**
 * Server-Side SEO & Meta Tag Transformer for Express
 * Injects route-specific <title>, <meta description>, OpenGraph, Canonical, and Schema.org
 * into the initial HTML response for Googlebot, search crawlers, and social media bots.
 */
export function injectSeoMeta(html: string, urlPath: string, hostOrigin?: string): string {
  const origin = (hostOrigin || process.env.APP_URL || BASE_APP_URL).replace(/\/$/, '');
  const config = getSeoForPath(urlPath);

  const title = config.title;
  const description = config.description;
  const keywords = config.keywords.join(', ');
  const canonicalUrl = `${origin}${config.canonicalPath}`;
  const logoUrl = `${origin}/logo.png`;

  let transformedHtml = html;

  // 1. Replace <title>
  transformedHtml = transformedHtml.replace(
    /<title>.*?<\/title>/i,
    `<title>${escapeHtml(title)}</title>`
  );

  // 2. Replace Primary Meta Tags
  transformedHtml = transformedHtml.replace(
    /<meta\s+name="title"\s+content=".*?"\s*\/?>/i,
    `<meta name="title" content="${escapeHtml(title)}" />`
  );

  transformedHtml = transformedHtml.replace(
    /<meta\s+name="description"\s+content=".*?"\s*\/?>/i,
    `<meta name="description" content="${escapeHtml(description)}" />`
  );

  if (keywords) {
    transformedHtml = transformedHtml.replace(
      /<meta\s+name="keywords"\s+content=".*?"\s*\/?>/i,
      `<meta name="keywords" content="${escapeHtml(keywords)}" />`
    );
  }

  // 3. Replace Canonical Link
  transformedHtml = transformedHtml.replace(
    /<link\s+rel="canonical"\s+href=".*?"\s*\/?>/i,
    `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`
  );

  // 4. Replace OpenGraph Tags
  transformedHtml = transformedHtml.replace(
    /<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:title" content="${escapeHtml(title)}" />`
  );

  transformedHtml = transformedHtml.replace(
    /<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:description" content="${escapeHtml(description)}" />`
  );

  transformedHtml = transformedHtml.replace(
    /<meta\s+property="og:url"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:url" content="${escapeHtml(canonicalUrl)}" />`
  );

  // 5. Replace Twitter Tags
  transformedHtml = transformedHtml.replace(
    /<meta\s+property="twitter:title"\s+content=".*?"\s*\/?>/i,
    `<meta property="twitter:title" content="${escapeHtml(title)}" />`
  );

  transformedHtml = transformedHtml.replace(
    /<meta\s+property="twitter:description"\s+content=".*?"\s*\/?>/i,
    `<meta property="twitter:description" content="${escapeHtml(description)}" />`
  );

  transformedHtml = transformedHtml.replace(
    /<meta\s+property="twitter:url"\s+content=".*?"\s*\/?>/i,
    `<meta property="twitter:url" content="${escapeHtml(canonicalUrl)}" />`
  );

  // 6. Inject Route-Specific Schema.org JSON-LD
  const routeSchema = config.structuredData || {
    '@context': 'https://schema.org',
    '@type': config.schemaType || 'WebApplication',
    'name': title,
    'description': description,
    'url': canonicalUrl,
    'image': logoUrl,
  };

  const schemas: any[] = [routeSchema];

  // For subpages: Provide BreadcrumbList so Google nests them under homepage
  if (urlPath !== '/' && urlPath !== '') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Studolink',
          'item': `${origin}/`
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': (config.title.split('–')[0] || config.title).split('|')[0]?.trim() || 'Studolink',
          'item': canonicalUrl
        }
      ]
    });
  } else {
    // For homepage: Provide WebSite schema with Sitelinks searchbox action
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': 'Studolink',
      'url': origin,
      'potentialAction': {
        '@type': 'SearchAction',
        'target': `${origin}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    });
  }

  const schemaScriptTags = schemas
    .map((s) => `<script type="application/ld+json">\n${JSON.stringify(s, null, 2)}\n</script>`)
    .join('\n');
  
  if (transformedHtml.includes('</head>')) {
    transformedHtml = transformedHtml.replace('</head>', `  ${schemaScriptTags}\n</head>`);
  }

  return transformedHtml;
}

/**
 * Escapes HTML attributes
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Generates an SEO-compliant sitemap.xml for Googlebot
 */
export function generateSitemapXml(hostOrigin?: string): string {
  const origin = (hostOrigin || process.env.APP_URL || BASE_APP_URL).replace(/\/$/, '');
  const now = new Date().toISOString().split('T')[0];

  const routes = [
    { path: '/', priority: '1.0', changefreq: 'daily' },
    { path: '/search', priority: '0.9', changefreq: 'daily' },
    { path: '/roommates', priority: '0.9', changefreq: 'daily' },
    { path: '/marketplace', priority: '0.9', changefreq: 'daily' },
    { path: '/hubs', priority: '0.8', changefreq: 'weekly' },
    { path: '/budget', priority: '0.8', changefreq: 'weekly' },
    { path: '/safety', priority: '0.8', changefreq: 'monthly' },
    { path: '/about', priority: '0.7', changefreq: 'monthly' },
    { path: '/help', priority: '0.7', changefreq: 'monthly' },
    { path: '/sell', priority: '0.7', changefreq: 'weekly' },
  ];

  const urlsXml = routes.map((r) => `  <url>
    <loc>${origin}${r.path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;
}

/**
 * Generates a robots.txt for search engines
 */
export function generateRobotsTxt(hostOrigin?: string): string {
  const origin = (hostOrigin || process.env.APP_URL || BASE_APP_URL).replace(/\/$/, '');
  return `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: ${origin}/sitemap.xml
`;
}
