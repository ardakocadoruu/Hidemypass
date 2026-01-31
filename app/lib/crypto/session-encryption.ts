/**
 * SESSION-BASED ENCRYPTION MODULE
 *
 * Dynamic session encryption for vault metadata (title, username, url, notes).
 * Each session generates a unique ephemeral key that exists only in memory.
 *
 * Security Benefits:
 * - No static signatures (replay attack protection)
 * - Session key never stored (memory-only)
 * - Unique per session (timestamp + nonce)
 * - Stolen session signature cannot be reused (different timestamp/nonce)
 * - Disconnect = session key lost = metadata inaccessible
 *
 * Combined with per-password encryption:
 * - Metadata: Session-based encryption (1 signature per session)
 * - Passwords: Per-password encryption (1 signature per password)
 * - Maximum privacy: Both metadata and passwords independently protected
 */

const PBKDF2_ITERATIONS = 200_000; // Session key derivation
const KEY_LENGTH = 256; // AES-256
const NONCE_LENGTH = 12; // GCM nonce
const TAG_LENGTH = 128; // GCM auth tag

export interface SessionMetadata {
  timestamp: number;
  sessionNonce: string; // Random nonce for this session
  publicKey: string; // Wallet public key
}

/**
 * Generate unique dynamic message for session
 * Different every time (timestamp + random nonce)
 */
export function generateSessionMessage(metadata: SessionMetadata): Uint8Array {
  const message =
    `ZK-Vault-Session-Key-v2\n` +
    `Timestamp: ${metadata.timestamp}\n` +
    `Session Nonce: ${metadata.sessionNonce}\n` +
    `Public Key: ${metadata.publicKey}\n` +
    `\n` +
    `This signature creates a temporary session key for metadata encryption.\n` +
    `The session key exists only in memory and is lost on disconnect.\n` +
    `This prevents replay attacks and ensures forward secrecy.\n` +
    `NEVER share your private key or seed phrase!`;

  return new TextEncoder().encode(message);
}

/**
 * Derive ephemeral session key from signature
 *
 * This key is used to encrypt vault metadata (title, username, url, notes)
 * The key is deterministic (same signature = same key) but the signature
 * itself is different each session (due to timestamp + nonce)
 */
export async function deriveSessionEncryptionKey(
  signature: Uint8Array,
  metadata: SessionMetadata
): Promise<CryptoKey> {
  console.log('🔑 Deriving session encryption key...');

  // Import signature as key material
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    signature,
    'PBKDF2',
    false,
    ['deriveKey']
  );

  // Unique salt based on session metadata
  const salt = new TextEncoder().encode(
    `zk-vault-session-${metadata.timestamp}-${metadata.sessionNonce}`
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
    false, // non-extractable (cannot be exported)
    ['encrypt', 'decrypt']
  );

  console.log('✅ Session key derived (memory-only, non-extractable)');

  return encryptionKey;
}

/**
 * Initialize new session and derive key
 *
 * Flow:
 * 1. Generate timestamp + random nonce
 * 2. Create unique message
 * 3. Request wallet signature
 * 4. Derive session key
 * 5. Return key + session info
 */
export async function initializeSession(
  signMessage: (msg: Uint8Array) => Promise<Uint8Array>,
  publicKey: string
): Promise<{ sessionKey: CryptoKey; sessionInfo: SessionMetadata }> {
  console.log('🔐 Initializing new session...');

  // Generate session metadata
  const sessionInfo: SessionMetadata = {
    timestamp: Date.now(),
    sessionNonce: btoa(
      String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32)))
    ),
    publicKey,
  };

  // Generate unique message
  const message = generateSessionMessage(sessionInfo);

  // Request signature from wallet
  console.log('📝 Requesting session signature from wallet...');
  const signature = await signMessage(message);

  // Derive session key
  const sessionKey = await deriveSessionEncryptionKey(signature, sessionInfo);

  console.log('✅ Session initialized successfully');
  console.log(`📅 Session timestamp: ${new Date(sessionInfo.timestamp).toISOString()}`);

  return { sessionKey, sessionInfo };
}

/**
 * Encrypt metadata with session key
 *
 * Encrypts: title, username, url, notes
 * Each field encrypted separately for granular access control
 */
export async function encryptMetadata(
  metadata: {
    title?: string;
    username?: string;
    url?: string;
    notes?: string;
  },
  sessionKey: CryptoKey
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
        sessionKey,
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
 * Decrypt metadata with session key
 *
 * Decrypts: title, username, url, notes
 */
export async function decryptMetadata(
  encryptedMetadata: {
    encryptedTitle?: { ciphertext: string; nonce: string };
    encryptedUsername?: { ciphertext: string; nonce: string };
    encryptedUrl?: { ciphertext: string; nonce: string };
    encryptedNotes?: { ciphertext: string; nonce: string };
  },
  sessionKey: CryptoKey
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
          sessionKey,
          ciphertext
        );

        result[cleanFieldName] = new TextDecoder().decode(plaintext);
      }
    }

    return result;
  } catch (error) {
    if (error instanceof Error && error.name === 'OperationError') {
      throw new Error('Session decryption failed: Invalid session key or tampered data');
    }
    throw error;
  }
}

/**
 * Restore session from stored session info
 *
 * Used when reopening vault in same browser session
 * (if we stored session info in memory, not localStorage!)
 */
export async function restoreSession(
  signMessage: (msg: Uint8Array) => Promise<Uint8Array>,
  sessionInfo: SessionMetadata
): Promise<CryptoKey> {
  console.log('🔄 Restoring session...');

  // Regenerate same message
  const message = generateSessionMessage(sessionInfo);

  // Request same signature
  const signature = await signMessage(message);

  // Derive same key
  const sessionKey = await deriveSessionEncryptionKey(signature, sessionInfo);

  console.log('✅ Session restored successfully');

  return sessionKey;
}

/**
 * Get session security information for UI display
 */
export function getSessionSecurityInfo() {
  return {
    encryption: 'AES-256-GCM',
    keyDerivation: 'PBKDF2-SHA256',
    iterations: PBKDF2_ITERATIONS,
    keyLength: KEY_LENGTH,
    nonceLength: NONCE_LENGTH,
    authTagLength: TAG_LENGTH,
    securityModel: 'session-based-ephemeral',
    storagePolicy: 'memory-only-never-persisted',
  };
}
