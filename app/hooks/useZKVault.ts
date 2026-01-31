/**
 * HIDEMYPASS VAULT HOOK
 *
 * Zero-Knowledge Password Manager with Light Protocol ZK Compression
 * - Client-side AES-256-GCM encryption
 * - Off-chain IPFS storage (Pinata)
 * - On-chain ZK Compressed accounts via Light Protocol
 * - Backend API for Light Protocol operations (SDK works server-side)
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { VersionedTransaction } from '@solana/web3.js';
import { createIPFSClient } from '../lib/ipfs/client';
import { deriveEncryptionKey, encryptVault, decryptVault } from '../lib/crypto/vault-encryption';
import { encryptCID, decryptCID } from '../lib/crypto/cid-encryption';
import {
  encryptPassword,
  decryptPassword,
  generatePasswordMessage,
  type PerPasswordMetadata
} from '../lib/crypto/per-password-encryption';
import {
  encryptMetadataWithVaultKey,
  decryptMetadataWithVaultKey
} from '../lib/crypto/metadata-encryption';
import { logger } from '../lib/utils/logger';

export interface PasswordEntry {
  id: string;
  createdAt: number;
  updatedAt: number;

  // Encryption version (for backward compatibility)
  encryptionVersion: 1 | 2 | 3; // 1 = vault-level, 2 = per-password, 3 = session+per-password

  // V1/V2 (deprecated): plaintext metadata
  title?: string;
  username?: string;
  url?: string;
  notes?: string;
  password?: string;

  // V3 (secure): session-encrypted metadata
  encryptedTitle?: { ciphertext: string; nonce: string };
  encryptedUsername?: { ciphertext: string; nonce: string };
  encryptedUrl?: { ciphertext: string; nonce: string };
  encryptedNotes?: { ciphertext: string; nonce: string };

  // V2+ (secure): per-password encrypted password
  encryptedPassword?: {
    ciphertext: string; // base64 encoded
    nonce: string; // base64 encoded
  };
}

export interface VaultData {
  passwords: PasswordEntry[];
}

export interface VaultState {
  passwords: PasswordEntry[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  isInitialized: boolean;
  lastSyncedCID: string | null;
  lastTxSignature: string | null;
}

const initialState: VaultState = {
  passwords: [],
  isLoading: false,
  isSaving: false,
  error: null,
  isInitialized: false,
  lastSyncedCID: null,
  lastTxSignature: null,
};

export function useZKVault() {
  const { connection } = useConnection();
  const { publicKey, signMessage, sendTransaction, signTransaction } = useWallet();
  const [vault, setVault] = useState<VaultState>(initialState);
  const [encryptionKey, setEncryptionKey] = useState<CryptoKey | null>(null);
  const isInitializing = useRef(false);

  const ipfsClient = useMemo(() => createIPFSClient(), []);

  /**
   * Initialize vault - derive encryption key and load from localStorage
   */
  const initializeVault = useCallback(async () => {
    if (!publicKey || !signMessage) {
      return;
    }

    // Prevent multiple simultaneous initializations
    if (isInitializing.current || vault.isInitialized) {
      logger.log('⚠️ Already initialized or initializing, skipping...');
      return;
    }
    isInitializing.current = true;

    setVault(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      logger.log('🔑 Deriving vault encryption key...');

      // Derive vault-level encryption key (for CID + vault container)
      const keyPromise = deriveEncryptionKey(signMessage);
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Wallet signature timeout. Please try again.')), 60000)
      );

      const key = await Promise.race([keyPromise, timeoutPromise]);
      setEncryptionKey(key);

      logger.log('✅ Vault encryption key derived successfully');

      // Load vault from blockchain (NO localStorage - pure decentralized)
      // Session will be initialized AFTER we know if there's stored session info
      logger.log('📦 Checking blockchain for vault...');

      try {
        const response = await fetch('/api/compress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'read',
            publicKey: publicKey.toBase58(),
          }),
        });

        if (response.ok) {
          const data = await response.json();

          if (data.cid) {
            logger.log('📦 Found encrypted CID on blockchain');

            // Clean encrypted CID
            const encryptedCid = data.cid.trim().replace(/['"]/g, '');

            // PRIVACY: Decrypt CID using wallet key
            logger.log('🔓 Decrypting CID...');
            const cleanCid = await decryptCID(encryptedCid, key);
            logger.log('✅ CID decrypted:', cleanCid);

            // Fetch from IPFS with multiple gateway fallbacks
            let ipfsResponse;
            const gateways = [
              `https://gateway.pinata.cloud/ipfs/${cleanCid}`,
              `https://ipfs.io/ipfs/${cleanCid}`,
              `https://cloudflare-ipfs.com/ipfs/${cleanCid}`,
            ];

            for (const gateway of gateways) {
              try {
                logger.log(`🔍 Trying gateway: ${gateway}`);
                ipfsResponse = await fetch(gateway);
                if (ipfsResponse.ok) {
                  logger.log('✅ Successfully fetched from gateway');
                  break;
                }
              } catch (err) {
                logger.log(`⚠️ Gateway failed: ${gateway}`);
                continue;
              }
            }

            if (ipfsResponse && ipfsResponse.ok) {
              const ipfsData = await ipfsResponse.json();

              logger.log('📦 IPFS data structure:', Object.keys(ipfsData));

              // Parse encrypted data from IPFS format
              // Pinata wraps in: { version, encrypted, timestamp }
              let encryptedPayload;
              if (typeof ipfsData.encrypted === 'string') {
                // If encrypted is string, parse it
                encryptedPayload = JSON.parse(ipfsData.encrypted);
              } else if (ipfsData.encrypted) {
                // Already object
                encryptedPayload = ipfsData.encrypted;
              } else {
                throw new Error('Invalid IPFS data format');
              }

              const { ciphertext, nonce } = encryptedPayload;

              // Safe base64 decode (works on all platforms)
              const base64ToBytes = (base64: string) => {
                const binaryString = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                  bytes[i] = binaryString.charCodeAt(i);
                }
                return bytes;
              };

              const ciphertextBytes = base64ToBytes(ciphertext);
              const nonceBytes = base64ToBytes(nonce);

              // Decrypt with correct parameters
              const vaultData = await decryptVault(ciphertextBytes, nonceBytes, key);

              logger.log('✅ Loaded and decrypted vault from blockchain!');

              setVault(prev => ({
                ...prev,
                passwords: vaultData.passwords,
                isLoading: false,
                isInitialized: true,
                lastSyncedCID: cleanCid,
                lastTxSignature: data.signature || null,
              }));

              return;
            }
          }
        }

        // No vault found on blockchain, start fresh
        logger.log('📦 No vault found on blockchain, starting fresh');

        setVault(prev => ({
          ...prev,
          isLoading: false,
          isInitialized: true,
        }));
      } catch (blockchainError) {
        logger.log('⚠️ Error loading from blockchain:', blockchainError);

        setVault(prev => ({
          ...prev,
          isLoading: false,
          isInitialized: true,
        }));
      }
    } catch (error) {
      logger.error('❌ Failed to initialize vault:', error);
      isInitializing.current = false;
      setVault(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to initialize vault',
      }));
    }
  }, [publicKey, signMessage, vault.isInitialized]);

  /**
   * Save passwords to IPFS + Light Protocol ZK Compression
   * 
   * Flow:
   * 1. Encrypt passwords with AES-256-GCM
   * 2. Upload encrypted data to IPFS (Pinata)
   * 3. Call backend API to prepare Light Protocol transaction
   * 4. Sign and send transaction via wallet
   */
  const savePasswords = useCallback(
    async (passwords: PasswordEntry[]) => {
      if (!publicKey || !encryptionKey || !signTransaction || !sendTransaction) {
        throw new Error('Vault not initialized');
      }

      setVault(prev => ({ ...prev, isSaving: true, error: null }));

      try {
        logger.log('🔒 Encrypting vault data...');

        // Encrypt vault with vault-encryption module
        const vaultData: VaultData = { passwords };
        const { ciphertext, nonce } = await encryptVault(vaultData, encryptionKey);

        // Convert to base64 for IPFS storage
        const encryptedPayload = {
          ciphertext: btoa(String.fromCharCode(...ciphertext)),
          nonce: btoa(String.fromCharCode(...nonce)),
        };
        const encrypted = JSON.stringify(encryptedPayload);

        logger.log('📤 Uploading to IPFS...');

        // Upload to IPFS
        const cid = await ipfsClient.upload(encrypted);

        logger.log('✅ Uploaded to IPFS! CID:', cid);

        // PRIVACY: Encrypt CID before putting on-chain
        logger.log('🔐 Encrypting CID for on-chain storage...');
        const encryptedCid = await encryptCID(cid, encryptionKey);
        logger.log('✅ CID encrypted (on-chain privacy protected)');

        logger.log('⛓️ Preparing Light Protocol ZK Compression transaction...');

        // Call backend API to prepare the transaction with ENCRYPTED CID
        const response = await fetch('/api/compress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'prepare-compress',
            walletAddress: publicKey.toBase58(),
            cid: encryptedCid, // Send encrypted CID, not plaintext
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to prepare transaction');
        }

        const { transaction: serializedTx, blockhash, stateTree } = await response.json();

        logger.log('✅ Transaction prepared by backend');
        logger.log('🌳 State tree:', stateTree);
        logger.log('👛 Requesting wallet signature...');

        // Deserialize the transaction
        const txBuffer = Buffer.from(serializedTx, 'base64');
        const tx = VersionedTransaction.deserialize(txBuffer);

        // Sign the transaction with wallet
        const signedTx = await signTransaction(tx);

        logger.log('📝 Transaction signed, sending...');

        // Send the signed transaction
        const signature = await connection.sendRawTransaction(signedTx.serialize(), {
          skipPreflight: true,
          preflightCommitment: 'processed',
        });

        logger.log('✅ Transaction sent! Signature:', signature);
        logger.log(`🌐 View on Solscan: https://solscan.io/tx/${signature}?cluster=devnet`);

        // NO localStorage - Pure decentralized storage (Blockchain + IPFS only)

        setVault(prev => ({
          ...prev,
          passwords,
          isSaving: false,
          lastSyncedCID: cid,
          lastTxSignature: signature,
        }));

        logger.log('🎉 Vault saved with Light Protocol ZK Compression!');
        logger.log(`📦 IPFS CID: ${cid}`);
        logger.log(`🔐 ZK Compressed on Solana`);
        logger.log(`📝 Transaction: ${signature}`);

        return { cid, signature };
      } catch (error) {
        logger.error('❌ Failed to save vault:', error);

        // Check if user rejected transaction
        const isUserRejection =
          error instanceof Error &&
          (error.message.includes('User rejected') ||
            error.message.includes('rejected the request'));

        const errorMessage = isUserRejection
          ? 'Transaction was rejected. Please approve the wallet signature to continue.'
          : error instanceof Error
            ? error.message
            : 'Failed to save vault';

        setVault(prev => ({
          ...prev,
          isSaving: false,
          error: errorMessage,
        }));
        throw error;
      }
    },
    [publicKey, encryptionKey, signTransaction, sendTransaction, connection, ipfsClient]
  );

  /**
   * Add a new password (V3: Vault-encrypted metadata + per-password encrypted password)
   */
  const addPassword = useCallback(
    async (passwordInput: Omit<PasswordEntry, 'id' | 'createdAt' | 'updatedAt' | 'encryptionVersion' | 'encryptedPassword' | 'encryptedTitle' | 'encryptedUsername' | 'encryptedUrl' | 'encryptedNotes'> & { password: string }) => {
      if (!signMessage || !encryptionKey) {
        throw new Error('Wallet not connected or vault not initialized');
      }

      const id = crypto.randomUUID();
      const createdAt = Date.now();

      logger.log('🔐 Using V3 encryption (vault metadata + per-password)...');

      // Step 1: Encrypt metadata with vault key
      logger.log('🔒 Encrypting metadata with vault key...');
      const encryptedMetadataFields = await encryptMetadataWithVaultKey(
        {
          title: passwordInput.title,
          username: passwordInput.username,
          url: passwordInput.url,
          notes: passwordInput.notes,
        },
        encryptionKey
      );

      // Step 2: Encrypt password with unique per-password key
      logger.log('🔐 Encrypting password with unique key...');
      const passwordMetadata: PerPasswordMetadata = {
        id,
        createdAt,
        version: 2,
      };

      const { ciphertext, nonce } = await encryptPassword(
        passwordInput.password,
        signMessage,
        passwordMetadata
      );

      // Create new password entry (V3 format)
      const newPassword: PasswordEntry = {
        id,
        createdAt,
        updatedAt: createdAt,
        encryptionVersion: 3,
        // Encrypted metadata (session key)
        ...encryptedMetadataFields,
        // Encrypted password (per-password key)
        encryptedPassword: {
          ciphertext: btoa(String.fromCharCode(...ciphertext)),
          nonce: btoa(String.fromCharCode(...nonce)),
        },
      };

      const updatedPasswords = [...vault.passwords, newPassword];
      await savePasswords(updatedPasswords);

      logger.log('✅ Password added with V3 encryption');
      logger.log('  → Metadata encrypted with vault key');
      logger.log('  → Password encrypted with unique key');

      return newPassword;
    },
    [vault.passwords, savePasswords, signMessage, encryptionKey]
  );

  /**
   * Update existing password (V2: Re-encrypt with unique key if password changes)
   */
  const updatePassword = useCallback(
    async (
      id: string,
      updates: Partial<Omit<PasswordEntry, 'id' | 'createdAt' | 'updatedAt' | 'encryptionVersion' | 'encryptedPassword'>> & { password?: string }
    ) => {
      if (!signMessage) {
        throw new Error('Wallet not connected');
      }

      const existingPassword = vault.passwords.find(p => p.id === id);
      if (!existingPassword) {
        throw new Error('Password not found');
      }

      let updatedEntry = { ...existingPassword, ...updates, updatedAt: Date.now() };

      // If password field is being updated, re-encrypt with V2
      if (updates.password) {
        logger.log('🔐 Re-encrypting password with V2 (unique key)...');

        const metadata: PerPasswordMetadata = {
          id: existingPassword.id,
          createdAt: existingPassword.createdAt,
          version: 2,
        };

        const { ciphertext, nonce } = await encryptPassword(
          updates.password,
          signMessage,
          metadata
        );

        updatedEntry = {
          ...updatedEntry,
          encryptionVersion: 2,
          encryptedPassword: {
            ciphertext: btoa(String.fromCharCode(...ciphertext)),
            nonce: btoa(String.fromCharCode(...nonce)),
          },
          password: undefined, // Remove plaintext password field
        };

        logger.log('✅ Password updated with V2 encryption');
      }

      const updatedPasswords = vault.passwords.map(p =>
        p.id === id ? updatedEntry : p
      );

      await savePasswords(updatedPasswords);
    },
    [vault.passwords, savePasswords, signMessage]
  );

  /**
   * Delete password
   */
  const deletePassword = useCallback(
    async (id: string) => {
      const updatedPasswords = vault.passwords.filter(p => p.id !== id);
      await savePasswords(updatedPasswords);
    },
    [vault.passwords, savePasswords]
  );

  /**
   * Decrypt password entry metadata (V3: vault-encrypted)
   */
  const decryptPasswordMetadata = useCallback(
    async (entry: PasswordEntry): Promise<{ title?: string; username?: string; url?: string; notes?: string }> => {
      if (!encryptionKey) {
        throw new Error('Vault not initialized');
      }

      // V1/V2: Plaintext metadata
      if (entry.encryptionVersion !== 3) {
        return {
          title: entry.title,
          username: entry.username,
          url: entry.url,
          notes: entry.notes,
        };
      }

      // V3: Vault-encrypted metadata
      logger.log(`🔓 Decrypting metadata (V3 vault): ${entry.id}`);

      const decrypted = await decryptMetadataWithVaultKey(
        {
          encryptedTitle: entry.encryptedTitle,
          encryptedUsername: entry.encryptedUsername,
          encryptedUrl: entry.encryptedUrl,
          encryptedNotes: entry.encryptedNotes,
        },
        encryptionKey
      );

      logger.log(`✅ Metadata decrypted (V3): ${entry.id}`);

      return decrypted;
    },
    [encryptionKey]
  );

  /**
   * Decrypt a password (supports V1, V2, V3)
   */
  const decryptPasswordEntry = useCallback(
    async (entry: PasswordEntry): Promise<string> => {
      if (!signMessage) {
        throw new Error('Wallet not connected');
      }

      // V1: Old format (plaintext in vault)
      if (entry.encryptionVersion === 1 || !entry.encryptionVersion) {
        return entry.password || '';
      }

      // V2/V3: Per-password encryption
      if ((entry.encryptionVersion === 2 || entry.encryptionVersion === 3) && entry.encryptedPassword) {
        logger.log(`🔓 Decrypting password (V${entry.encryptionVersion}): ${entry.id}`);

        const metadata: PerPasswordMetadata = {
          id: entry.id,
          createdAt: entry.createdAt,
          version: 2,
        };

        // Base64 decode
        const ciphertext = new Uint8Array(
          atob(entry.encryptedPassword.ciphertext)
            .split('')
            .map(c => c.charCodeAt(0))
        );
        const nonce = new Uint8Array(
          atob(entry.encryptedPassword.nonce)
            .split('')
            .map(c => c.charCodeAt(0))
        );

        const decrypted = await decryptPassword(ciphertext, nonce, signMessage, metadata);
        logger.log(`✅ Password decrypted (V${entry.encryptionVersion}): ${entry.id}`);

        return decrypted;
      }

      throw new Error('Invalid password entry format');
    },
    [signMessage]
  );

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setVault(prev => ({ ...prev, error: null }));
  }, []);

  // Initialize when wallet connects
  useEffect(() => {
    if (publicKey && signMessage && !vault.isInitialized && !vault.isLoading) {
      initializeVault();
    } else if (!publicKey) {
      setVault(initialState);
      setEncryptionKey(null);
      isInitializing.current = false;
    }
  }, [publicKey, signMessage, vault.isInitialized, vault.isLoading, initializeVault]);

  return {
    ...vault,
    initializeVault,
    addPassword,
    updatePassword,
    deletePassword,
    decryptPasswordEntry,
    decryptPasswordMetadata,
    clearError,
    isVaultSaving: vault.isSaving,
  };
}

/**
 * Helper: Encrypt vault data using AES-256-GCM
 */
async function encryptVaultData(
  data: VaultData,
  key: CryptoKey
): Promise<string> {
  const plaintext = JSON.stringify(data);
  const plaintextBuffer = new TextEncoder().encode(plaintext);

  // Generate random nonce
  const nonce = crypto.getRandomValues(new Uint8Array(12));

  // Encrypt
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: nonce },
    key,
    plaintextBuffer
  );

  // Combine nonce + ciphertext
  const combined = new Uint8Array(nonce.length + ciphertext.byteLength);
  combined.set(nonce);
  combined.set(new Uint8Array(ciphertext), nonce.length);

  // Base64 encode for storage
  return btoa(String.fromCharCode(...combined));
}

/**
 * Helper: Decrypt vault data
 */
async function decryptVaultData(
  encrypted: string,
  key: CryptoKey
): Promise<VaultData> {
  // Base64 decode
  const combined = new Uint8Array(
    atob(encrypted)
      .split('')
      .map(c => c.charCodeAt(0))
  );

  // Split nonce and ciphertext
  const nonce = combined.slice(0, 12);
  const ciphertext = combined.slice(12);

  // Decrypt
  const plaintextBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: nonce },
    key,
    ciphertext
  );

  const plaintext = new TextDecoder().decode(plaintextBuffer);
  return JSON.parse(plaintext);
}
