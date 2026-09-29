import { describe, it, expect } from 'vitest';
import { checkRateLimit } from '../src/lib/serverRateLimiter';

describe('Server Rate Limiter (serverRateLimiter)', () => {
  it('should allow initial requests within limit', async () => {
    const testIp = `test-ip-${Date.now()}`;
    const result = await checkRateLimit(testIp);
    expect(result.success).toBe(true);
    expect(result.limit).toBe(25);
    expect(result.remaining).toBeGreaterThanOrEqual(0);
  });

  it('should reject requests that exceed 25 per minute per IP', async () => {
    const heavyIp = `heavy-ip-${Date.now()}`;
    for (let i = 0; i < 25; i++) {
      await checkRateLimit(heavyIp);
    }
    const blockedResult = await checkRateLimit(heavyIp);
    expect(blockedResult.success).toBe(false);
    expect(blockedResult.retryAfterSec).toBeGreaterThanOrEqual(1);
  });
});
