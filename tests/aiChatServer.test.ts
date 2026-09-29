import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { sanitizeInput, processChatGeneration, ChatValidationError } from '../src/lib/aiChatServer';

describe('AI Chat Server Module (aiChatServer)', () => {
  let savedApiKey: string | undefined;

  beforeEach(() => {
    savedApiKey = process.env.GEMINI_API_KEY;
  });

  afterEach(() => {
    if (savedApiKey !== undefined) {
      process.env.GEMINI_API_KEY = savedApiKey;
    } else {
      delete process.env.GEMINI_API_KEY;
    }
  });

  it('should strip malicious script tags and javascript: URIs', () => {
    const malicious = '<script>alert("hacked")</script>Hello <script src="evil.js"></script>Mitra javascript:void(0)';
    const clean = sanitizeInput(malicious);
    expect(clean).not.toContain('<script>');
    expect(clean).not.toContain('javascript:');
    expect(clean).toContain('Hello');
    expect(clean).toContain('Mitra');
  });

  it('should throw ChatValidationError for empty messages', async () => {
    await expect(processChatGeneration({ message: '' })).rejects.toThrow(ChatValidationError);
    await expect(processChatGeneration({ message: '   ' })).rejects.toThrow(ChatValidationError);
  });

  it('should throw ChatValidationError for excessively long messages (>1000 chars)', async () => {
    const longMsg = 'a'.repeat(1005);
    await expect(processChatGeneration({ message: longMsg })).rejects.toThrow(ChatValidationError);
  });

  it('should provide offline fallback response when API key is unavailable', async () => {
    delete process.env.GEMINI_API_KEY;
    const res = await processChatGeneration({ message: 'Kota me Allen ke paas room rent kitna hai?' });
    expect(res).toBeDefined();
    expect(res.reply).toContain('Kota');
    expect(res.model).toBe('studolink-offline-advisor');
  });

  it('should provide Magadh/Nawada regional hostel guide for Nawada queries', async () => {
    delete process.env.GEMINI_API_KEY;
    const res = await processChatGeneration({ message: 'Nawada me student hostel and rent rate kya hai?' });
    expect(res).toBeDefined();
    expect(res.reply).toContain('Nawada');
    expect(res.reply).toContain('Station Road');
  });
});
