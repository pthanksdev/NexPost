import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.TOKEN_ENCRYPTION_KEY || 'fallback-key-change-me-in-production';

/**
 * Encrypt a plaintext string with AES-256
 */
export function encrypt(plaintext: string): string {
  if (!plaintext) return '';
  return CryptoJS.AES.encrypt(plaintext, SECRET_KEY).toString();
}

/**
 * Decrypt an AES-256 encrypted string
 */
export function decrypt(ciphertext: string): string {
  if (!ciphertext) return '';
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}

/**
 * Generate a random token for CSRF / unsubscribe links
 */
export function generateToken(length: number = 32): string {
  return CryptoJS.lib.WordArray.random(length).toString(CryptoJS.enc.Hex);
}
