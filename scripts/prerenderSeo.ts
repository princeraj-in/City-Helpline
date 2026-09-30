import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { injectSeoMeta } from '../src/lib/serverSeo.ts';
import { ROUTE_SEO_CONFIG, BASE_APP_URL } from '../src/lib/seoConfig.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '..', 'dist');

async function prerenderRoutes() {
  const baseIndexPath = path.resolve(distDir, 'index.html');

  if (!fs.existsSync(baseIndexPath)) {
    console.warn('dist/index.html not found, skipping SEO prerender.');
    return;
  }

  const rawHtml = fs.readFileSync(baseIndexPath, 'utf-8');
  const routes = Object.keys(ROUTE_SEO_CONFIG);

  console.log(`Starting SEO prerender for ${routes.length} routes...`);

  for (const route of routes) {
    const transformedHtml = injectSeoMeta(rawHtml, route, BASE_APP_URL);

    if (route === '/') {
      // Overwrite main dist/index.html with pristine homepage metadata
      fs.writeFileSync(baseIndexPath, transformedHtml, 'utf-8');
      console.log(`✓ Prerendered root / -> dist/index.html`);
    } else {
      const routeDir = path.resolve(distDir, route.replace(/^\//, ''));
      fs.mkdirSync(routeDir, { recursive: true });
      const targetPath = path.resolve(routeDir, 'index.html');
      fs.writeFileSync(targetPath, transformedHtml, 'utf-8');
      console.log(`✓ Prerendered ${route} -> dist/${route.replace(/^\//, '')}/index.html`);
    }
  }

  console.log('All routes prerendered with unique titles, meta descriptions, and Schema.org JSON-LD successfully!');
}

prerenderRoutes().catch((err) => {
  console.error('Error during SEO prerender:', err);
  process.exit(1);
});
