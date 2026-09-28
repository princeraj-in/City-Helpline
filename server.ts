import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { checkRateLimit } from './src/lib/serverRateLimiter';
import { processChatGeneration, ChatValidationError } from './src/lib/aiChatServer';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || '3000', 10);
const isProduction = process.env.NODE_ENV === 'production';

// Whitelist of trusted origins allowed to access the API
const TRUSTED_ORIGINS = [
  'https://studolink.imprince.me',
  'https://studolink.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
];

function isTrustedOrigin(origin?: string): boolean {
  if (!origin) return false;
  if (TRUSTED_ORIGINS.includes(origin)) return true;
  // Localhost development with any port
  if (/^http:\/\/localhost(:\d+)?$/.test(origin) || /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)) return true;
  // Cloud Run / AI Studio preview environment
  if (/^https:\/\/[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+\.run\.app$/.test(origin) || /^https:\/\/[a-zA-Z0-9-]+\.run\.app$/.test(origin)) return true;
  // Vercel deployment previews
  if (/^https:\/\/studolink-[a-zA-Z0-9-]+\.vercel\.app$/.test(origin)) return true;
  return false;
}

async function startServer() {
  const app = express();

  // Security & Whitelist-Based CORS Middleware
  app.use((req, res, next) => {
    const origin = (req.headers.origin || req.headers.Origin) as string | undefined;

    if (origin) {
      if (isTrustedOrigin(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Vary', 'Origin');
      } else {
        // Reject unauthorized/untrusted origins for preflight or API requests
        if (req.method === 'OPTIONS' || req.path.startsWith('/api')) {
          res.status(403).json({ error: 'CORS Forbidden: Untrusted origin' });
          return;
        }
      }
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    );
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    if (req.path.startsWith('/api')) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    }

    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    next();
  });

  app.use(express.json({ limit: '2mb' }));

  // AI Chat Endpoint (Centralized AI Service + Shared Rate Limiter)
  app.post('/api/chat', async (req: Request, res: Response) => {
    try {
      // 1. Persistent Shared Rate Limiting
      const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 
                       req.socket.remoteAddress || 
                       'anonymous';

      const rateResult = await checkRateLimit(clientIp);

      res.setHeader('X-RateLimit-Limit', rateResult.limit.toString());
      res.setHeader('X-RateLimit-Remaining', rateResult.remaining.toString());
      res.setHeader('X-RateLimit-Reset', rateResult.reset.toString());

      if (!rateResult.success) {
        res.setHeader('Retry-After', rateResult.retryAfterSec.toString());
        res.status(429).json({
          error: `Too many queries. Please wait ${rateResult.retryAfterSec} seconds before sending another message to AI Mitra. (अधिकतम 25 प्रश्न प्रति मिनट अनुमति है)`,
          retryAfter: rateResult.retryAfterSec,
          fallback: true,
        });
        return;
      }

      // 2. Centralized AI Chat Generation
      const result = await processChatGeneration(req.body);

      res.status(200).json(result);
    } catch (error: any) {
      if (error instanceof ChatValidationError) {
        res.status(error.statusCode).json({ error: error.message });
        return;
      }

      console.error('Error in /api/chat:', error);
      res.status(500).json({
        error: error?.message || 'Internal Server Error while generating AI response',
        fallback: true,
      });
    }
  });

  // Health check endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', service: 'Studolink AI Mitra Service', time: new Date().toISOString() });
  });

  // Mount Vite in dev or serve static files in production
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Studolink Full-Stack Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
