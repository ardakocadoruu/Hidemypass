/**
 * MASTER PASSWORD MODULE
 *
 * Additional security layer: Even if wallet signature is stolen,
 * master password is still required to decrypt vaults.
 *
 * Security: Wallet signature + Master password = Encryption key
 */

/**
 * Derive encryption key from wallet signature + master password
 *
 * This provides two-factor security:
 * 1. Something you have (wallet signature)
 * 2. Something you know (master password)
 */
export async function deriveKeyWithMasterPassword(
  walletSignature: Uint8Array,
  masterPassword: string
): Promise<CryptoKey> {
  // Hash master password
  const passwordBytes = new TextEncoder().encode(masterPassword);
  const passwordHash = await crypto.subtle.digest('SHA-256', passwordBytes);

  // Combine wallet signature + password hash
  const combined = new Uint8Array(walletSignature.length + passwordHash.byteLength);
  combined.set(walletSignature);
  combined.set(new Uint8Array(passwordHash), walletSignature.length);

  // Import combined material for PBKDF2
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    combined.buffer,
    'PBKDF2',
    false,
    ['deriveKey']
  );

  // Derive encryption key with PBKDF2 (300k iterations)
  const salt = new TextEncoder().encode('zk-vault-master-password-v1');

  const encryptionKey = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt.buffer as ArrayBuffer,
      iterations: 300_000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false, // non-extractable
    ['encrypt', 'decrypt']
  );

  return encryptionKey;
}

/**
 * Validate master password strength
 */
export function validateMasterPassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('At least 8 characters required');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('At least one uppercase letter required');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('At least one lowercase letter required');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('At least one number required');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Hash master password for verification (not for encryption!)
 * Stored on-chain to verify user knows the password
 */
export async function hashMasterPasswordForVerification(
  password: string
): Promise<string> {
  const passwordBytes = new TextEncoder().encode(password);

  // Use Argon2-like stretching with PBKDF2
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    passwordBytes,
    'PBKDF2',
    false,
    ['deriveBits']
  );

  const salt = new TextEncoder().encode('zk-vault-password-verification');

  const hash = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100_000, // Lower for verification
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );

  return btoa(String.fromCharCode(...new Uint8Array(hash)));
}
