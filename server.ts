import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { checkRateLimit } from './src/lib/serverRateLimiter';
import { processChatGeneration, ChatValidationError } from './src/lib/aiChatServer';
import { 
  verifyAdminCaller, 
  assignUserRoleServer, 
  recordAuditLogServer, 
  getAuditLogsServer 
} from './src/lib/serverAdminService';
import { generateSignedUploadParams } from './src/lib/cloudinaryServer';
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

  // Secure Server-Authoritative Role Assignment Endpoint
  app.post('/api/admin/role', async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      const idToken = (authHeader || '').replace(/^Bearer\s+/i, '').trim();
      if (!idToken) {
        res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
        return;
      }

      const caller = await verifyAdminCaller(authHeader);
      const result = await assignUserRoleServer(caller, idToken, req.body);
      res.status(200).json(result);
    } catch (error: any) {
      const statusCode = error?.message?.includes('Unauthorized') ? 401 :
                         error?.message?.includes('Forbidden') ? 403 :
                         error?.message?.includes('Invalid') ? 400 : 500;
      res.status(statusCode).json({ error: error?.message || 'Failed to update user role' });
    }
  });

  // Tamper-Proof Administrative Audit Logging Endpoints
  app.post('/api/admin/audit', async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      const caller = await verifyAdminCaller(authHeader);
      const log = await recordAuditLogServer(caller, req.body);
      res.status(201).json(log);
    } catch (error: any) {
      const statusCode = error?.message?.includes('Unauthorized') ? 401 :
                         error?.message?.includes('Forbidden') ? 403 : 500;
      res.status(statusCode).json({ error: error?.message || 'Failed to record audit log' });
    }
  });

  app.get('/api/admin/audit', async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      await verifyAdminCaller(authHeader);
      const logs = await getAuditLogsServer();
      res.status(200).json(logs);
    } catch (error: any) {
      const statusCode = error?.message?.includes('Unauthorized') ? 401 :
                         error?.message?.includes('Forbidden') ? 403 : 500;
      res.status(statusCode).json({ error: error?.message || 'Failed to fetch audit logs' });
    }
  });

  // Secure Cloudinary Signed Upload Endpoint (Authenticated Users Only)
  app.post('/api/upload/sign', async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      const idToken = (authHeader || '').replace(/^Bearer\s+/i, '').trim();
      if (!idToken) {
        res.status(401).json({ error: 'Unauthorized: Authentication required for signed uploads' });
        return;
      }

      let uid = 'authenticated_user';
      try {
        const parts = idToken.split('.');
        if (parts[1]) {
          const decoded = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
          uid = decoded.user_id || decoded.sub || 'authenticated_user';
        }
      } catch {}

      const folder = (req.body?.folder || 'studolink_uploads').replace(/[^a-zA-Z0-9_\-]/g, '');
      const signedData = generateSignedUploadParams(uid, folder);

      if (!signedData) {
        res.status(200).json({ 
          signed: false, 
          message: 'Server signature keys not configured. Falling back to strict validated unsigned preset.' 
        });
        return;
      }

      res.status(200).json({ signed: true, ...signedData });
    } catch (error: any) {
      res.status(500).json({ error: error?.message || 'Failed to sign upload' });
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
