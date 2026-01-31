/**
 * METADATA ENCRYPTION MODULE
 *
 * Vault-level metadata encryption for password entries.
 * Uses the same deterministic vault key as container encryption.
 *
 * Security Benefits:
 * - Metadata (title, username, url, notes) always encrypted
 * - Same key as vault container (deterministic, no session issues)
 * - No reconnect problems (key always same)
 * - Simpler than session-based encryption
 * - Still provides strong privacy (metadata not visible in IPFS)
 *
 * Architecture:
 * - Vault Key → Encrypts container + metadata
 * - Per-Password Key → Encrypts password field
 * - Defense in depth: Two encryption layers
 */

const NONCE_LENGTH = 12; // GCM nonce
const TAG_LENGTH = 128; // GCM auth tag

/**
 * Encrypt metadata fields with vault key
 *
 * Encrypts: title, username, url, notes
 * Each field encrypted separately for granular access control
 */
export async function encryptMetadataWithVaultKey(
  metadata: {
    title?: string;
    username?: string;
    url?: string;
    notes?: string;
  },
  vaultKey: CryptoKey
): Promise<{
  encryptedTitle?: { ciphertext: string; nonce: string };
  encryptedUsername?: { ciphertext: string; nonce: string };
  encryptedUrl?: { ciphertext: string; nonce: string };
  encryptedNotes?: { ciphertext: string; nonce: string };
}> {
  const result: any = {};

  // Encrypt each field separately
  for (const [key, value] of Object.entries(metadata)) {
    if (value) {
      const nonce = crypto.getRandomValues(new Uint8Array(NONCE_LENGTH));
      const plaintext = new TextEncoder().encode(value);

      const ciphertext = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: nonce, tagLength: TAG_LENGTH },
        vaultKey,
        plaintext
      );

      result[`encrypted${key.charAt(0).toUpperCase() + key.slice(1)}`] = {
        ciphertext: btoa(String.fromCharCode(...new Uint8Array(ciphertext))),
        nonce: btoa(String.fromCharCode(...nonce)),
      };
    }
  }

  return result;
}

/**
 * Decrypt metadata fields with vault key
 *
 * Decrypts: title, username, url, notes
 */
export async function decryptMetadataWithVaultKey(
  encryptedMetadata: {
    encryptedTitle?: { ciphertext: string; nonce: string };
    encryptedUsername?: { ciphertext: string; nonce: string };
    encryptedUrl?: { ciphertext: string; nonce: string };
    encryptedNotes?: { ciphertext: string; nonce: string };
  },
  vaultKey: CryptoKey
): Promise<{
  title?: string;
  username?: string;
  url?: string;
  notes?: string;
}> {
  const result: any = {};

  try {
    // Decrypt each field separately
    for (const [key, value] of Object.entries(encryptedMetadata)) {
      if (value && value.ciphertext && value.nonce) {
        // Extract field name (e.g., "encryptedTitle" -> "title")
        const fieldName = key.replace('encrypted', '').toLowerCase();
        const firstChar = fieldName.charAt(0).toLowerCase();
        const cleanFieldName = firstChar + fieldName.slice(1);

        // Decode base64
        const ciphertext = new Uint8Array(
          atob(value.ciphertext)
            .split('')
            .map(c => c.charCodeAt(0))
        );
        const nonce = new Uint8Array(
          atob(value.nonce)
            .split('')
            .map(c => c.charCodeAt(0))
        );

        // Decrypt
        const plaintext = await crypto.subtle.decrypt(
          { name: 'AES-GCM', iv: nonce, tagLength: TAG_LENGTH },
          vaultKey,
          ciphertext
        );

        result[cleanFieldName] = new TextDecoder().decode(plaintext);
      }
    }

    return result;
  } catch (error) {
    if (error instanceof Error && error.name === 'OperationError') {
      throw new Error('Metadata decryption failed: Invalid vault key or tampered data');
    }
    throw error;
  }
}
