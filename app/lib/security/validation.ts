/**
 * SECURITY VALIDATION
 *
 * Input validation and sanitization for security hardening
 */

/**
 * Validate IPFS CID format
 */
export function validateIPFSCID(cid: string): boolean {
  // CIDv0: Qm[A-Za-z0-9]{44}
  // CIDv1: b[A-Za-z0-9]{58} or more
  const cidV0Regex = /^Qm[A-Za-z0-9]{44}$/;
  const cidV1Regex = /^b[A-Za-z2-7]{58,}$/;

  return cidV0Regex.test(cid) || cidV1Regex.test(cid);
}

/**
 * Validate password entry
 */
export interface PasswordEntryValidation {
  valid: boolean;
  errors: string[];
}

export function validatePasswordEntry(entry: {
  title?: string;
  username?: string;
  password?: string;
  url?: string;
  notes?: string;
}): PasswordEntryValidation {
  const errors: string[] = [];

  // Title validation
  if (!entry.title || entry.title.trim().length === 0) {
    errors.push('Title is required');
  } else if (entry.title.length > 100) {
    errors.push('Title must be less than 100 characters');
  }

  // Username validation
  if (!entry.username || entry.username.trim().length === 0) {
    errors.push('Username is required');
  } else if (entry.username.length > 200) {
    errors.push('Username must be less than 200 characters');
  }

  // Password validation
  if (!entry.password || entry.password.length === 0) {
    errors.push('Password is required');
  } else if (entry.password.length > 500) {
    errors.push('Password must be less than 500 characters');
  }

  // URL validation (optional)
  if (entry.url && entry.url.length > 0) {
    if (entry.url.length > 500) {
      errors.push('URL must be less than 500 characters');
    }

    // Basic URL format check
    try {
      new URL(entry.url);
    } catch {
      errors.push('Invalid URL format');
    }
  }

  // Notes validation (optional)
  if (entry.notes && entry.notes.length > 2000) {
    errors.push('Notes must be less than 2000 characters');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Sanitize string input (prevent XSS)
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .trim();
}

/**
 * Validate vault size
 */
export function validateVaultSize(passwordCount: number): boolean {
  // Max 1000 passwords per vault
  return passwordCount <= 1000;
}

/**
 * Rate limiting helper (simple client-side)
 */
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private maxAttempts: number;
  private windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  /**
   * Check if action is allowed
   */
  isAllowed(key: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];

    // Remove old attempts outside the window
    const recentAttempts = attempts.filter(time => now - time < this.windowMs);

    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }

    // Record this attempt
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);

    return true;
  }

  /**
   * Get remaining time until allowed (in ms)
   */
  getRetryAfter(key: string): number {
    const attempts = this.attempts.get(key) || [];
    if (attempts.length === 0) return 0;

    const oldestAttempt = Math.min(...attempts);
    const timeUntilReset = this.windowMs - (Date.now() - oldestAttempt);

    return Math.max(0, timeUntilReset);
  }

  /**
   * Reset rate limit for a key
   */
  reset(key: string): void {
    this.attempts.delete(key);
  }
}

/**
 * Validate encryption key strength
 */
export function validateEncryptionKey(key: CryptoKey): boolean {
  // Check if key is AES-256-GCM
  return (
    key.algorithm.name === 'AES-GCM' &&
    (key.algorithm as AesKeyAlgorithm).length === 256
  );
}

/**
 * Check for suspicious activity patterns
 */
export function detectSuspiciousActivity(actions: string[]): boolean {
  // Too many rapid actions
  if (actions.length > 100) {
    return true;
  }

  // Check for repeated failed attempts
  const failedAttempts = actions.filter(a => a.includes('failed')).length;
  if (failedAttempts > 10) {
    return true;
  }

  return false;
}

/**
 * Validate wallet signature
 */
export function validateSignature(signature: Uint8Array): boolean {
  // Signature should be 64 bytes for Ed25519
  return signature.length === 64;
}
