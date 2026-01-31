/**
 * PER-PASSWORD ENCRYPTION MODULE
 *
 * Each password has its own unique encryption key derived from a unique signature.
 * This provides defense-in-depth: even if one signature is stolen, only that
 * specific password is compromised, not the entire vault.
 *
 * Security Model:
 * - Each password gets a unique deterministic message to sign
 * - Message includes: password ID + creation timestamp
 * - Same message = same signature = same key (deterministic)
 * - Different passwords = different messages = different keys
 *
 * Benefits:
 * - Signature theft only compromises one password
 * - XSS attack damage is limited to active session
 * - Backward compatible with vault-level encryption (v1)
 */

const PBKDF2_ITERATIONS = 300_000; // Same security as vault-level for maximum protection
const KEY_LENGTH = 256; // AES-256
const NONCE_LENGTH = 12; // GCM nonce
const TAG_LENGTH = 128; // GCM auth tag

export interface PerPasswordMetadata {
  id: string;
  createdAt: number;
  version: number; // Encryption version (for future upgrades)
}

/**
 * Generate deterministic message for password signature
 * Same metadata = same message = same signature = same key
 */
export function generatePasswordMessage(metadata: PerPasswordMetadata): Uint8Array {
  const message =
    `ZK-Vault-Password-Key-v${metadata.version}\n` +
    `Password ID: ${metadata.id}\n` +
    `Created: ${metadata.createdAt}\n` +
    `\n` +
    `This signature will be used to encrypt/decrypt a single password entry.\n` +
    `Each password has its own unique encryption key.\n` +
    `NEVER share your private key or seed phrase!`;

  return new TextEncoder().encode(message);
}

/**
 * Derive password-specific encryption key from signature
 *
 * Uses PBKDF2 with 150k iterations (faster than vault-level but still secure)
 * Each password has unique salt based on ID and version
 */
export async function derivePasswordEncryptionKey(
  signature: Uint8Array,
  metadata: PerPasswordMetadata
): Promise<CryptoKey> {
  // Import signature as key material for PBKDF2
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    signature,
    'PBKDF2',
    false,
    ['deriveKey']
  );

  // Unique salt per password (includes ID and version)
  const salt = new TextEncoder().encode(
    `zk-vault-pwd-${metadata.id}-v${metadata.version}-salt`
  );

  // Derive AES-256-GCM key using PBKDF2
  const encryptionKey = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: KEY_LENGTH },
    false, // non-extractable
    ['encrypt', 'decrypt']
  );

  return encryptionKey;
}

/**
 * Encrypt a single password with its own unique key
 *
 * Flow:
 * 1. Generate unique message based on password metadata
 * 2. Request wallet signature for that message
 * 3. Derive encryption key from signature
 * 4. Encrypt password data with AES-256-GCM
 *
 * Returns: { ciphertext, nonce } for storage
 */
export async function encryptPassword(
  passwordData: string,
  signMessage: (msg: Uint8Array) => Promise<Uint8Array>,
  metadata: PerPasswordMetadata
): Promise<{ ciphertext: Uint8Array; nonce: Uint8Array }> {
  console.log(`🔐 Encrypting password with unique key: ${metadata.id}`);

  // Generate unique deterministic message
  const message = generatePasswordMessage(metadata);

  // Request signature from wallet
  console.log(`🔑 Requesting signature for password: ${metadata.id}`);
  const signature = await signMessage(message);

  // Derive password-specific encryption key
  const key = await derivePasswordEncryptionKey(signature, metadata);

  // Generate random nonce (12 bytes for GCM)
  const nonce = crypto.getRandomValues(new Uint8Array(NONCE_LENGTH));

  // Encrypt password data
  const plaintext = new TextEncoder().encode(passwordData);
  const ciphertext = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: nonce,
      tagLength: TAG_LENGTH,
    },
    key,
    plaintext
  );

  console.log(`✅ Password encrypted with unique key: ${metadata.id}`);

  return {
    ciphertext: new Uint8Array(ciphertext),
    nonce,
  };
}

/**
 * Decrypt a single password with its own unique key
 *
 * Flow:
 * 1. Generate same deterministic message (same metadata)
 * 2. Request same wallet signature
 * 3. Derive same encryption key
 * 4. Decrypt password data
 *
 * Throws if decryption fails (wrong key or tampered data)
 */
export async function decryptPassword(
  ciphertext: Uint8Array,
  nonce: Uint8Array,
  signMessage: (msg: Uint8Array) => Promise<Uint8Array>,
  metadata: PerPasswordMetadata
): Promise<string> {
  console.log(`🔓 Decrypting password with unique key: ${metadata.id}`);

  try {
    // Generate same deterministic message
    const message = generatePasswordMessage(metadata);

    // Request same signature from wallet
    console.log(`🔑 Requesting signature to decrypt password: ${metadata.id}`);
    const signature = await signMessage(message);

    // Derive same encryption key
    const key = await derivePasswordEncryptionKey(signature, metadata);

    // Decrypt with AES-256-GCM
    const plaintext = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: nonce,
        tagLength: TAG_LENGTH,
      },
      key,
      ciphertext
    );

    console.log(`✅ Password decrypted successfully: ${metadata.id}`);

    return new TextDecoder().decode(plaintext);
  } catch (error) {
    if (error instanceof Error && error.name === 'OperationError') {
      throw new Error('Decryption failed: Invalid key or tampered data');
    }
    throw error;
  }
}

/**
 * Get security information for UI display
 */
export function getPerPasswordSecurityInfo() {
  return {
    encryption: 'AES-256-GCM',
    keyDerivation: 'PBKDF2-SHA256',
    iterations: PBKDF2_ITERATIONS,
    keyLength: KEY_LENGTH,
    nonceLength: NONCE_LENGTH,
    authTagLength: TAG_LENGTH,
    securityModel: 'per-password-key',
  };
}
