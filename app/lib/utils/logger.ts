/**
 * Production-safe logger utility
 * Disables console logs in production while keeping them in development
 */

const isProd = process.env.NODE_ENV === 'production';

export const logger = {
  log: (...args: any[]) => {
    if (!isProd) {
      console.log(...args);
    }
  },

  error: (...args: any[]) => {
    // Always log errors, even in production
    console.error(...args);
  },

  warn: (...args: any[]) => {
    if (!isProd) {
      console.warn(...args);
    }
  },

  info: (...args: any[]) => {
    if (!isProd) {
      console.info(...args);
    }
  },
};
