/**
 * CRITICAL SECURITY MODULE: AES-256-GCM Encryption
 *
 * This module handles symmetric encryption using AES-256-GCM.
 *
 * SECURITY RULES:
 * - EVERY encryption MUST use a NEW random nonce
 * - Nonce MUST be 12 bytes (96 bits) for GCM
 * - Nonce is generated using crypto.getRandomValues (cryptographically secure)
 * - GCM provides authenticated encryption (confidentiality + integrity)
 * - NEVER reuse a nonce with the same key (catastrophic security failure)
 */

import { NONCE_LENGTH } from '../constants';

/**
 * Encrypts data using AES-256-GCM
 *
 * SECURITY: Generates a NEW random nonce for each encryption.
 * The nonce must be sent alongside the ciphertext for decryption.
 *
 * @param data - Plaintext string to encrypt
 * @param key - CryptoKey for AES-256-GCM
 * @returns Object with ciphertext and nonce (both as Uint8Array)
 */
export async function encrypt(
  data: string,
  key: CryptoKey
): Promise<{ ciphertext: Uint8Array; nonce: Uint8Array }> {
  // 1. Generate NEW random nonce (CRITICAL: must be unique for each encryption)
  const nonce = crypto.getRandomValues(new Uint8Array(NONCE_LENGTH));

  // 2. Encode plaintext to bytes
  const encodedData = new TextEncoder().encode(data);

  // 3. Encrypt using AES-256-GCM
  const ciphertext = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: nonce as Uint8Array, // Initialization vector (same as nonce in GCM)
    },
    key,
    encodedData as Uint8Array
  );

  return {
    ciphertext: new Uint8Array(ciphertext),
    nonce,
  };
}

/**
 * Decrypts data using AES-256-GCM
 *
 * @param ciphertext - Encrypted data as Uint8Array
 * @param nonce - Nonce used during encryption
 * @param key - CryptoKey for AES-256-GCM
 * @returns Decrypted plaintext string
 * @throws Error if authentication fails (data tampered)
 */
export async function decrypt(
  ciphertext: Uint8Array,
  nonce: Uint8Array,
  key: CryptoKey
): Promise<string> {
  try {
    // 1. Decrypt using AES-256-GCM
    const decryptedData = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: nonce as Uint8Array,
      },
      key,
      ciphertext as Uint8Array
    );

    // 2. Decode bytes to string
    return new TextDecoder().decode(decryptedData);
  } catch (error) {
    // GCM authentication failed - data was tampered or wrong key
    throw new Error('Decryption failed: Invalid key or corrupted data');
  }
}
