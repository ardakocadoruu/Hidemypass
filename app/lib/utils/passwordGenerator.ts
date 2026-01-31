/**
 * Password Generator Utility
 *
 * Generates cryptographically secure random passwords.
 */

import type { PasswordGeneratorOptions, PasswordStrength } from '../types';

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

// Ambiguous characters that can be confused
const AMBIGUOUS = '0O1lI';

/**
 * Generates a random password based on options
 *
 * Uses crypto.getRandomValues for cryptographically secure randomness
 *
 * @param options - Password generation options
 * @returns Generated password string
 */
export function generatePassword(options: PasswordGeneratorOptions): string {
  let charset = '';
  let requiredChars: string[] = [];

  // Build character set based on options
  if (options.includeUppercase) {
    let chars = UPPERCASE;
    if (options.excludeAmbiguous) {
      chars = chars.replace(/[OI]/g, '');
    }
    charset += chars;
    requiredChars.push(getRandomChar(chars));
  }

  if (options.includeLowercase) {
    let chars = LOWERCASE;
    if (options.excludeAmbiguous) {
      chars = chars.replace(/[l]/g, '');
    }
    charset += chars;
    requiredChars.push(getRandomChar(chars));
  }

  if (options.includeNumbers) {
    let chars = NUMBERS;
    if (options.excludeAmbiguous) {
      chars = chars.replace(/[01]/g, '');
    }
    charset += chars;
    requiredChars.push(getRandomChar(chars));
  }

  if (options.includeSymbols) {
    charset += SYMBOLS;
    requiredChars.push(getRandomChar(SYMBOLS));
  }

  if (charset.length === 0) {
    throw new Error('At least one character type must be selected');
  }

  // Fill remaining characters randomly
  const remainingLength = options.length - requiredChars.length;
  const randomChars: string[] = [];

  for (let i = 0; i < remainingLength; i++) {
    randomChars.push(getRandomChar(charset));
  }

  // Combine and shuffle all characters
  const allChars = [...requiredChars, ...randomChars];
  return shuffleArray(allChars).join('');
}

/**
 * Gets a random character from charset using crypto.getRandomValues
 */
function getRandomChar(charset: string): string {
  const randomIndex = crypto.getRandomValues(new Uint32Array(1))[0] % charset.length;
  return charset[randomIndex];
}

/**
 * Shuffles an array using Fisher-Yates algorithm with crypto.getRandomValues
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomIndex = crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1);
    [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
  }
  return shuffled;
}

/**
 * Evaluates password strength
 *
 * @param password - Password to evaluate
 * @returns Strength score, label, and color
 */
export function evaluatePasswordStrength(password: string): PasswordStrength {
  let score = 0;

  // Length checks
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;

  // Complexity checks
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  // Normalize to 0-4
  score = Math.min(4, Math.floor(score * 4 / 6));

  const labels: Array<'Very Weak' | 'Weak' | 'Medium' | 'Strong' | 'Very Strong'> =
    ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'];
  const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981'];

  return {
    score,
    label: labels[score],
    color: colors[score],
  };
}
