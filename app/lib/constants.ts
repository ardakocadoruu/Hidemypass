// Application constants
export const APP_NAME = "HideMyPass";
export const APP_VERSION = "3.0.0";
export const APP_DESCRIPTION = "Military-grade password vault with multi-layer encryption on Solana blockchain. Your passwords, truly hidden.";

// Encryption constants
export const SIGN_MESSAGE = "ZK-Password-Vault-Authentication-Key-v1";
export const ENCRYPTION_SALT = "zk-password-vault-v1";
export const ENCRYPTION_INFO = "encryption-key";
export const NONCE_LENGTH = 12; // 96 bits

// Vault constants
export const VAULT_SEED = "zk-password-vault";
export const VAULT_VERSION = 1;
export const MAX_PASSWORDS = 500; // Security limit

// UI constants
export const TOAST_DURATION = 3000;
export const DEBOUNCE_DELAY = 300;

// Password generator defaults
export const DEFAULT_PASSWORD_LENGTH = 16;
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 64;

// Network
export const SUPPORTED_NETWORKS = ['devnet', 'mainnet-beta'] as const;
export type SupportedNetwork = typeof SUPPORTED_NETWORKS[number];
