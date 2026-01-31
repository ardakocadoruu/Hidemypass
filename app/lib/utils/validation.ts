/**
 * Validation utilities
 */

import { NewPasswordForm } from '../types';
import { MAX_PASSWORDS } from '../constants';

/**
 * Validates a password form entry
 */
export function validatePasswordForm(form: NewPasswordForm): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  // Website validation
  if (!form.website || form.website.trim().length === 0) {
    errors.website = 'Website is required';
  } else if (form.website.trim().length > 100) {
    errors.website = 'Website must be less than 100 characters';
  }

  // Username validation
  if (!form.username || form.username.trim().length === 0) {
    errors.username = 'Username is required';
  } else if (form.username.trim().length > 100) {
    errors.username = 'Username must be less than 100 characters';
  }

  // Password validation
  if (!form.password || form.password.length === 0) {
    errors.password = 'Password is required';
  } else if (form.password.length < 1) {
    errors.password = 'Password must be at least 1 character';
  } else if (form.password.length > 500) {
    errors.password = 'Password must be less than 500 characters';
  }

  // Notes validation (optional)
  if (form.notes && form.notes.length > 500) {
    errors.notes = 'Notes must be less than 500 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Normalizes a website URL
 */
export function normalizeWebsite(website: string): string {
  return website
    .toLowerCase()
    .trim()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '');
}
