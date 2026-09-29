import { describe, it, expect } from 'vitest';
import { cn, formatWhatsAppUrl } from '../src/lib/utils';

describe('Classnames Utility (cn)', () => {
  it('should combine standard string class names', () => {
    expect(cn('px-4', 'py-2', 'bg-blue-500')).toBe('px-4 py-2 bg-blue-500');
  });

  it('should resolve Tailwind class conflicts by taking the latter class', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  it('should ignore falsey, null, and undefined values', () => {
    expect(cn('base-class', false && 'hidden', null, undefined, 0 && 'zero', 'active')).toBe('base-class active');
  });

  it('should handle object conditionals', () => {
    expect(cn({ 'is-active': true, 'is-disabled': false })).toBe('is-active');
  });
});

describe('WhatsApp Formatter Utility (formatWhatsAppUrl)', () => {
  it('should format 10-digit phone numbers with +91 country code prefix', () => {
    const url = formatWhatsAppUrl('9876543210', 'Hello');
    expect(url).toBe('https://wa.me/919876543210?text=Hello');
  });

  it('should handle phone numbers that already include country code 91 without duplication', () => {
    const url = formatWhatsAppUrl('919876543210', 'Test message');
    expect(url).toBe('https://wa.me/919876543210?text=Test%20message');
  });

  it('should strip special characters, spaces, hyphens, and brackets from phone numbers', () => {
    const url = formatWhatsAppUrl('+91 (98765) 43210', 'Emergency SOS! 🚨');
    expect(url).toBe('https://wa.me/919876543210?text=Emergency%20SOS!%20%F0%9F%9A%A8');
  });

  it('should properly encode complex messages, URLs, and Hindi characters', () => {
    const url = formatWhatsAppUrl('9876543210', 'नमस्ते, क्या यह कमरा उपलब्ध है? (https://studolink.imprince.me)');
    expect(url).toContain('https://wa.me/919876543210?text=');
    expect(url).toContain(encodeURIComponent('नमस्ते, क्या यह कमरा उपलब्ध है? (https://studolink.imprince.me)'));
  });
});
