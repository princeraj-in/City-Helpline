import crypto from 'crypto';

export interface CloudinarySignatureParams {
  timestamp: number;
  folder: string;
  allowed_formats?: string;
  max_file_size?: number;
  transformation?: string;
  tags?: string;
}

export interface SignedUploadResponse {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
  allowedFormats: string;
  transformation?: string;
}

/**
 * Generates a cryptographically signed Cloudinary upload payload for authenticated users.
 * High-Security signed flow prevents unauthenticated uploads and enforces folder/transformation rules.
 */
export function generateSignedUploadParams(
  userUid: string,
  folder = 'studolink_uploads'
): SignedUploadResponse | null {
  const apiKey = (process.env.CLOUDINARY_API_KEY || '').trim();
  const apiSecret = (process.env.CLOUDINARY_API_SECRET || '').trim();
  const cloudName = (process.env.CLOUDINARY_CLOUD_NAME || process.env.VITE_CLOUDINARY_CLOUD_NAME || '').trim();

  if (!apiKey || !apiSecret || !cloudName) {
    return null;
  }

  const timestamp = Math.round(Date.now() / 1000);
  const allowedFormats = 'jpg,png,webp,jpeg';
  const transformation = 'c_limit,w_1600,h_1600,q_auto,f_auto';
  const tags = `user_${userUid},studolink_app`;

  // Parameters to sign (sorted alphabetically by key)
  const paramsToSign: Record<string, string | number> = {
    folder,
    tags,
    timestamp,
    transformation,
  };

  const sortedKeys = Object.keys(paramsToSign).sort();
  const stringToSign = sortedKeys.map((key) => `${key}=${paramsToSign[key]}`).join('&');

  // Cloudinary standard signature uses SHA-1 (or SHA-256)
  const signature = crypto
    .createHash('sha1')
    .update(stringToSign + apiSecret)
    .digest('hex');

  return {
    signature,
    timestamp,
    apiKey,
    cloudName,
    folder,
    allowedFormats,
    transformation,
  };
}
