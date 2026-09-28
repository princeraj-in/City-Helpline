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

export default function handler(req: any, res: any) {
  // Whitelist-based CORS configuration
  const origin = (req.headers.origin || req.headers.Origin) as string | undefined;
  if (origin) {
    if (isTrustedOrigin(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Vary', 'Origin');
    } else {
      res.status(403).json({ error: 'CORS Forbidden: Untrusted origin' });
      return;
    }
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  res.status(200).json({
    status: 'healthy',
    service: 'Studolink AI Mitra Service',
    timestamp: new Date().toISOString(),
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    nodeEnv: process.env.NODE_ENV || 'production',
  });
}
