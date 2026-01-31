import { PublicKey } from '@solana/web3.js';

// Password entry interface
export interface PasswordEntry {
  id: string;
  website: string;
  username: string;
  notes?: string;
  favicon?: string;
  createdAt: number;
  updatedAt: number;

  // Encryption version (for backward compatibility)
  encryptionVersion: 1 | 2; // 1 = vault-level (old), 2 = per-password (new)

  // V1 (deprecated): plaintext password stored in vault
  password?: string;

  // V2 (secure): encrypted password with unique key
  encryptedPassword?: {
    ciphertext: string; // base64 encoded
    nonce: string; // base64 encoded
  };
}

// Decrypted vault (client-side only, NEVER send over network)
export interface DecryptedVault {
  passwords: PasswordEntry[];
  version: number;
}

// On-chain encrypted vault
export interface EncryptedVault {
  owner: string;
  encryptedData: string; // base64
  nonce: string; // base64
  version: number;
  updatedAt: number;
}

// Vault state management
export interface VaultState {
  isLoading: boolean;
  isInitialized: boolean;
  isSaving: boolean;
  error: string | null;
  passwords: PasswordEntry[];
  lastSyncedAt: number | null;
}

// New password form
export interface NewPasswordForm {
  website: string;
  username: string;
  password: string;
  notes?: string;
}

// Password generator options
export interface PasswordGeneratorOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeAmbiguous: boolean; // Exclude 0, O, l, 1, I
}

// Password strength evaluation
export interface PasswordStrength {
  score: number; // 0-4
  label: 'Very Weak' | 'Weak' | 'Medium' | 'Strong' | 'Very Strong';
  color: string;
}
