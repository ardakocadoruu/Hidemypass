/**
 * CRITICAL SECURITY MODULE: Encryption Index
 *
 * High-level vault encryption functions.
 *
 * SECURITY RULES:
 * - DecryptedVault objects MUST NEVER be sent over network
 * - DecryptedVault objects MUST NEVER be logged
 * - DecryptedVault objects MUST NEVER be stored in localStorage
 * - Only encrypted data goes to blockchain
 */

export { deriveEncryptionKey } from './keyDerivation';
export { encrypt, decrypt } from './aes';

import { encrypt, decrypt } from './aes';
import type { DecryptedVault, PasswordEntry } from '../types';

/**
 * Encrypts an entire vault (all passwords)
 *
 * SECURITY: This function converts the vault to JSON and encrypts it.
 * A new nonce is generated for each encryption.
 *
 * @param vault - Decrypted vault object (NEVER send this over network)
 * @param key - AES-256-GCM key
 * @returns Encrypted ciphertext and nonce
 */
export async function encryptVault(
  vault: DecryptedVault,
  key: CryptoKey
): Promise<{ ciphertext: Uint8Array; nonce: Uint8Array }> {
  // Serialize vault to JSON
  const json = JSON.stringify(vault);

  // Encrypt (generates new nonce automatically)
  return encrypt(json, key);
}

/**
 * Decrypts a vault
 *
 * SECURITY: The returned DecryptedVault MUST NEVER leave the client.
 * It should only exist in memory and never be:
 * - Sent over network
 * - Stored in localStorage
 * - Logged to console
 *
 * @param ciphertext - Encrypted vault data
 * @param nonce - Nonce used during encryption
 * @param key - AES-256-GCM key
 * @returns Decrypted vault object (KEEP IN MEMORY ONLY)
 */
export async function decryptVault(
  ciphertext: Uint8Array,
  nonce: Uint8Array,
  key: CryptoKey
): Promise<DecryptedVault> {
  // Decrypt to JSON string
  const json = await decrypt(ciphertext, nonce, key);

  // Parse and return
  return JSON.parse(json) as DecryptedVault;
}
