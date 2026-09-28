import { checkRateLimit } from '../src/lib/serverRateLimiter';
import { processChatGeneration, ChatValidationError } from '../src/lib/aiChatServer';

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

export default async function handler(req: any, res: any) {
  // Whitelist-based CORS configuration
  const origin = (req.headers.origin || req.headers.Origin) as string | undefined;

  if (origin) {
    if (isTrustedOrigin(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Vary', 'Origin');
    } else {
      // Reject unauthorized/untrusted origins
      res.status(403).json({ error: 'CORS Forbidden: Untrusted origin' });
      return;
    }
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );
  // Security Headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
    return;
  }

  try {
    // 1. Persistent Shared Rate Limiting (Upstash Redis + fallback)
    const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 
                     req.headers['x-real-ip'] || 
                     req.socket?.remoteAddress || 
                     'anonymous';

    const rateResult = await checkRateLimit(clientIp);

    res.setHeader('X-RateLimit-Limit', rateResult.limit.toString());
    res.setHeader('X-RateLimit-Remaining', rateResult.remaining.toString());
    res.setHeader('X-RateLimit-Reset', rateResult.reset.toString());

    if (!rateResult.success) {
      res.setHeader('Retry-After', rateResult.retryAfterSec.toString());
      res.status(429).json({
        error: `Rate limit reached. Please wait ${rateResult.retryAfterSec} seconds before asking again. (अधिकतम 25 प्रश्न प्रति मिनट अनुमति है)`,
        retryAfter: rateResult.retryAfterSec,
      });
      return;
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};

    // 2. Centralized AI Chat Generation
    const result = await processChatGeneration(body);

    res.status(200).json(result);
  } catch (error: any) {
    if (error instanceof ChatValidationError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }

    console.error('Error processing /api/chat request:', error?.message || error);
    res.status(500).json({
      error: error?.message || 'Internal Server Error while communicating with Gemini AI.',
      fallback: true,
    });
  }
}
