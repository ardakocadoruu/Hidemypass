/**
 * Security utilities for input sanitization and protection
 * Silent security layer - no user-facing warnings
 */

/**
 * Sanitize user input to prevent XSS attacks
 * Removes dangerous HTML/JavaScript patterns
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';

  // Remove HTML tags
  let sanitized = input.replace(/<[^>]*>/g, '');

  // Remove JavaScript event handlers
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');

  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '');

  // Remove data: protocol (can be used for XSS)
  sanitized = sanitized.replace(/data:text\/html/gi, '');

  // Remove script tags and content
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  return sanitized.trim();
}

/**
 * Validate URL to prevent XSS via malicious URLs
 */
export function sanitizeUrl(url: string): string {
  if (!url) return '';

  const trimmed = url.trim().toLowerCase();

  // Block dangerous protocols
  const dangerousProtocols = [
    'javascript:',
    'data:',
    'vbscript:',
    'file:',
    'about:',
  ];

  for (const protocol of dangerousProtocols) {
    if (trimmed.startsWith(protocol)) {
      return ''; // Return empty string for dangerous URLs
    }
  }

  // Only allow http, https, or relative URLs
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('./') ||
    trimmed.startsWith('../')
  ) {
    return url;
  }

  // If no protocol, assume https
  return `https://${url}`;
}

/**
 * Validate and sanitize password metadata
 */
export function sanitizePasswordMetadata(data: {
  title?: string;
  username?: string;
  url?: string;
  notes?: string;
}) {
  return {
    title: sanitizeInput(data.title || ''),
    username: sanitizeInput(data.username || ''),
    url: sanitizeUrl(data.url || ''),
    notes: sanitizeInput(data.notes || ''),
  };
}

/**
 * Rate limiting for decryption operations
 */
class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();
  private maxAttempts: number;
  private windowMs: number;

  constructor(maxAttempts: number = 20, windowMs: number = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  check(key: string): boolean {
    const now = Date.now();
    const record = this.attempts.get(key);

    if (!record || now > record.resetTime) {
      this.attempts.set(key, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return true;
    }

    if (record.count >= this.maxAttempts) {
      return false;
    }

    record.count++;
    return true;
  }

  reset(key: string) {
    this.attempts.delete(key);
  }
}

export const decryptionRateLimiter = new RateLimiter(20, 60000);

/**
 * Secure memory cleanup
 */
export function secureMemoryWipe(data: string | Uint8Array): void {
  if (typeof data === 'string') {
    data = '';
  } else if (data instanceof Uint8Array) {
    for (let i = 0; i < data.length; i++) {
      data[i] = 0;
    }
  }
}

/**
 * Session timeout manager
 */
export class SessionTimeout {
  private timeoutId: NodeJS.Timeout | null = null;
  private readonly timeoutMs: number;
  private readonly onTimeout: () => void;

  constructor(timeoutMs: number = 15 * 60 * 1000, onTimeout: () => void) {
    this.timeoutMs = timeoutMs;
    this.onTimeout = onTimeout;
  }

  start() {
    this.reset();
    this.setupEventListeners();
  }

  reset() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {
      this.onTimeout();
    }, this.timeoutMs);
  }

  stop() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.removeEventListeners();
  }

  private setupEventListeners() {
    if (typeof window === 'undefined') return;

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, this.handleActivity);
    });
  }

  private removeEventListeners() {
    if (typeof window === 'undefined') return;

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      window.removeEventListener(event, this.handleActivity);
    });
  }

  private handleActivity = () => {
    this.reset();
  };
}

/**
 * Clipboard security - auto-clear after timeout
 */
export async function copyToClipboardSecure(
  text: string,
  clearAfterMs: number = 30000
): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);

    setTimeout(async () => {
      try {
        await navigator.clipboard.writeText('');
      } catch (err) {
        // Silent fail
      }
    }, clearAfterMs);

    return true;
  } catch (err) {
    console.error('Clipboard copy failed:', err);
    return false;
  }
}
