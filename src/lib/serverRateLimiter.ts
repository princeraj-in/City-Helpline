import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  retryAfterSec: number;
}

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

let upstashRateLimiter: Ratelimit | null = null;

if (UPSTASH_URL && UPSTASH_TOKEN) {
  try {
    const redis = new Redis({
      url: UPSTASH_URL,
      token: UPSTASH_TOKEN,
    });

    upstashRateLimiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(25, '1 m'),
      prefix: 'studolink:chat:ratelimit',
      analytics: true,
    });
  } catch (err) {
    console.warn('Could not initialize Upstash Redis rate limiter, using local fallback:', err);
  }
}

// Fallback sliding window implementation for local development if Upstash environment variables are not provided
interface LocalRecord {
  timestamps: number[];
}
const localFallbackMap = new Map<string, LocalRecord>();
const LOCAL_WINDOW_MS = 60 * 1000; // 1 minute
const LOCAL_MAX_LIMIT = 25; // 25 requests per minute

export async function checkRateLimit(identifier: string): Promise<RateLimitResult> {
  const cleanId = identifier.trim() || 'anonymous';

  if (upstashRateLimiter) {
    try {
      const { success, limit, remaining, reset } = await upstashRateLimiter.limit(cleanId);
      const now = Date.now();
      const retryAfterSec = Math.max(1, Math.ceil((reset - now) / 1000));
      return {
        success,
        limit,
        remaining,
        reset,
        retryAfterSec,
      };
    } catch (err) {
      console.warn('Upstash rate limit check error, falling back to sliding window:', err);
    }
  }

  // Local fallback sliding window
  const now = Date.now();
  let record = localFallbackMap.get(cleanId);
  if (!record) {
    record = { timestamps: [] };
    localFallbackMap.set(cleanId, record);
  }
  record.timestamps = record.timestamps.filter((t) => now - t < LOCAL_WINDOW_MS);

  const isAllowed = record.timestamps.length < LOCAL_MAX_LIMIT;
  if (isAllowed) {
    record.timestamps.push(now);
  }

  const oldest = record.timestamps[0] || now;
  const reset = oldest + LOCAL_WINDOW_MS;
  const retryAfterSec = Math.max(1, Math.ceil((reset - now) / 1000));
  const remaining = Math.max(0, LOCAL_MAX_LIMIT - record.timestamps.length);

  return {
    success: isAllowed,
    limit: LOCAL_MAX_LIMIT,
    remaining,
    reset,
    retryAfterSec,
  };
}
