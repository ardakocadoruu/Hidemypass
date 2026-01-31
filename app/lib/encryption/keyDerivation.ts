/**
 * CRITICAL SECURITY MODULE: Key Derivation
 *
 * This module derives encryption keys from wallet signatures using HKDF.
 *
 * SECURITY RULES:
 * - Keys are NEVER stored, only kept in memory
 * - Same signature always produces same key (deterministic)
 * - Uses HKDF (HMAC-based Key Derivation Function)
 * - Keys are non-extractable from Web Crypto API
 */

import { SIGN_MESSAGE, ENCRYPTION_SALT, ENCRYPTION_INFO } from '../constants';

/**
 * Derives an AES-256-GCM encryption key from wallet signature
 *
 * @param signMessage - Function to sign a message with wallet
 * @returns CryptoKey for AES-256-GCM encryption (non-extractable)
 */
export async function deriveEncryptionKey(
  signMessage: (message: Uint8Array) => Promise<Uint8Array>
): Promise<CryptoKey> {
  // 1. Sign a fixed message to get deterministic signature
  const messageBytes = new TextEncoder().encode(SIGN_MESSAGE);
  const signature = await signMessage(messageBytes);

  // 2. Import signature as key material for HKDF
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    signature,
    "HKDF",
    false, // Not extractable
    ["deriveKey"]
  );

  // 3. Derive AES-256-GCM key using HKDF
  const encryptionKey = await crypto.subtle.deriveKey(
    {
      name: "HKDF",
      salt: new TextEncoder().encode(ENCRYPTION_SALT),
      info: new TextEncoder().encode(ENCRYPTION_INFO),
      hash: "SHA-256",
    },
    keyMaterial,
    {
      name: "AES-GCM",
      length: 256 // 256-bit key
    },
    false, // CRITICAL: Not extractable (key cannot be exported)
    ["encrypt", "decrypt"]
  );

  return encryptionKey;
}
