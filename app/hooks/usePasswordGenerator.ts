/**
 * usePasswordGenerator Hook
 *
 * Manages password generator state and settings
 */

'use client';

import { useState, useCallback } from 'react';
import { generatePassword } from '../lib/utils';
import type { PasswordGeneratorOptions } from '../lib/types';
import {
  DEFAULT_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
  MAX_PASSWORD_LENGTH,
} from '../lib/constants';

const defaultOptions: PasswordGeneratorOptions = {
  length: DEFAULT_PASSWORD_LENGTH,
  includeUppercase: true,
  includeLowercase: true,
  includeNumbers: true,
  includeSymbols: true,
  excludeAmbiguous: true,
};

export function usePasswordGenerator() {
  const [options, setOptions] = useState<PasswordGeneratorOptions>(defaultOptions);
  const [generatedPassword, setGeneratedPassword] = useState<string>('');

  const generate = useCallback(() => {
    try {
      const password = generatePassword(options);
      setGeneratedPassword(password);
      return password;
    } catch (error) {
      return '';
    }
  }, [options]);

  const updateOptions = useCallback((updates: Partial<PasswordGeneratorOptions>) => {
    setOptions((prev) => ({ ...prev, ...updates }));
  }, []);

  const reset = useCallback(() => {
    setOptions(defaultOptions);
    setGeneratedPassword('');
  }, []);

  return {
    options,
    generatedPassword,
    generate,
    updateOptions,
    reset,
  };
}
