import { describe, it, expect } from 'vitest';
import { cn } from '../src/lib/utils';

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
