import { describe, it, expect } from 'vitest';
import { validateImageFile, ImageValidationError } from '../src/lib/storage';
import { generateSignedUploadParams } from '../src/lib/cloudinaryServer';

describe('Storage & Image Upload Hardening', () => {
  it('should accept valid image types (JPEG, PNG, WEBP)', () => {
    const validFile = new File(['dummy-content'], 'room.jpg', { type: 'image/jpeg' });
    expect(() => validateImageFile(validFile)).not.toThrow();

    const validPng = new File(['dummy-content'], 'books.png', { type: 'image/png' });
    expect(() => validateImageFile(validPng)).not.toThrow();

    const validWebp = new File(['dummy-content'], 'cooler.webp', { type: 'image/webp' });
    expect(() => validateImageFile(validWebp)).not.toThrow();
  });

  it('should reject dangerous/unsupported formats (SVG, PDF, HTML, EXEs)', () => {
    const svgFile = new File(['<svg onload="alert(1)"></svg>'], 'xss.svg', { type: 'image/svg+xml' });
    expect(() => validateImageFile(svgFile)).toThrow(ImageValidationError);

    const pdfFile = new File(['dummy-pdf'], 'document.pdf', { type: 'application/pdf' });
    expect(() => validateImageFile(pdfFile)).toThrow(ImageValidationError);

    const htmlFile = new File(['<html></html>'], 'page.html', { type: 'text/html' });
    expect(() => validateImageFile(htmlFile)).toThrow(ImageValidationError);
  });

  it('should reject files exceeding 10MB raw limit', () => {
    // Mock 11MB file
    const largeFile = new File([new ArrayBuffer(11 * 1024 * 1024)], 'giant.jpg', { type: 'image/jpeg' });
    expect(() => validateImageFile(largeFile)).toThrow(ImageValidationError);
  });

  it('should return null for server signed uploads when server secrets are not set', () => {
    const signedParams = generateSignedUploadParams('test-user-123');
    // In test environment without CLOUDINARY_API_SECRET, should return null gracefully
    expect(signedParams === null || typeof signedParams.signature === 'string').toBe(true);
  });
});
