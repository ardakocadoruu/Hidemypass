/**
 * HIDEMYPASS - SOLANA CLIENT
 *
 * TypeScript client for interacting with the on-chain HideMyPass program
 * Handles initialization, updates, and retrieval of vault metadata
 */

import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  TransactionInstruction,
  SYSVAR_RENT_PUBKEY,
} from '@solana/web3.js';
import { sha256 } from 'js-sha256';

// Program ID (must match Anchor.toml and lib.rs)
export const ZK_VAULT_PROGRAM_ID = new PublicKey(
  'ZKVau1t1111111111111111111111111111111111'
);

// Instruction discriminators (Anchor uses first 8 bytes of SHA256 hash)
const INSTRUCTION_DISCRIMINATORS = {
  initialize_vault: Buffer.from(sha256('global:initialize_vault').slice(0, 16), 'hex'),
  update_vault: Buffer.from(sha256('global:update_vault').slice(0, 16), 'hex'),
  close_vault: Buffer.from(sha256('global:close_vault').slice(0, 16), 'hex'),
};

/**
 * Vault Account Data Structure
 */
export interface VaultAccount {
  owner: PublicKey;
  ipfsCid: string;
  ownershipHash: Uint8Array; // 32 bytes
  createdAt: number; // Unix timestamp
  updatedAt: number; // Unix timestamp
  version: number; // u8
  updateCount: number; // u32
}

/**
 * Manual deserialization for vault account
 * TODO: Replace with proper Borsh deserialization after program deployment
 */
function deserializeVaultAccount(data: Buffer): any {
  // Simplified manual deserialization
  // In production, use proper Borsh schema
  return {
    owner: data.slice(0, 32),
    // Add proper deserialization here after program is deployed
  };
}

/**
 * HideMyPass Client
 */
export class ZKVaultClient {
  constructor(
    private connection: Connection,
    private programId: PublicKey = ZK_VAULT_PROGRAM_ID
  ) {}

  /**
   * Derive vault PDA for a wallet
   */
  async getVaultPDA(owner: PublicKey): Promise<[PublicKey, number]> {
    return PublicKey.findProgramAddressSync(
      [Buffer.from('vault'), owner.toBuffer()],
      this.programId
    );
  }

  /**
   * Check if vault exists for a wallet
   */
  async vaultExists(owner: PublicKey): Promise<boolean> {
    try {
      const [vaultPDA] = await this.getVaultPDA(owner);
      const accountInfo = await this.connection.getAccountInfo(vaultPDA);
      return accountInfo !== null;
    } catch {
      return false;
    }
  }

  /**
   * Fetch vault account data
   */
  async getVault(owner: PublicKey): Promise<VaultAccount | null> {
    try {
      const [vaultPDA] = await this.getVaultPDA(owner);
      const accountInfo = await this.connection.getAccountInfo(vaultPDA);

      if (!accountInfo) {
        return null;
      }

      // Skip 8-byte discriminator
      const data = accountInfo.data.slice(8);

      // TODO: Proper Borsh deserialization after program deployment
      const vaultData = deserializeVaultAccount(data);

      return {
        owner: new PublicKey(vaultData.owner),
        ipfsCid: '', // Placeholder
        ownershipHash: new Uint8Array(32),
        createdAt: 0,
        updatedAt: 0,
        version: 1,
        updateCount: 0,
      };
    } catch (error) {
      console.error('Failed to fetch vault:', error);
      return null;
    }
  }

  /**
   * Create initialize_vault instruction
   */
  createInitializeInstruction(
    owner: PublicKey,
    vaultPDA: PublicKey,
    ipfsCid: string,
    ownershipHash: Uint8Array
  ): TransactionInstruction {
    // Encode instruction data
    const data = Buffer.concat([
      INSTRUCTION_DISCRIMINATORS.initialize_vault,
      this.encodeString(ipfsCid),
      Buffer.from(ownershipHash),
    ]);

    return new TransactionInstruction({
      keys: [
        { pubkey: vaultPDA, isSigner: false, isWritable: true },
        { pubkey: owner, isSigner: true, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      programId: this.programId,
      data,
    });
  }

  /**
   * Create update_vault instruction
   */
  createUpdateInstruction(
    owner: PublicKey,
    vaultPDA: PublicKey,
    newIpfsCid: string,
    newOwnershipHash: Uint8Array
  ): TransactionInstruction {
    const data = Buffer.concat([
      INSTRUCTION_DISCRIMINATORS.update_vault,
      this.encodeString(newIpfsCid),
      Buffer.from(newOwnershipHash),
    ]);

    return new TransactionInstruction({
      keys: [
        { pubkey: vaultPDA, isSigner: false, isWritable: true },
        { pubkey: owner, isSigner: true, isWritable: false },
      ],
      programId: this.programId,
      data,
    });
  }

  /**
   * Create close_vault instruction
   */
  createCloseInstruction(
    owner: PublicKey,
    vaultPDA: PublicKey
  ): TransactionInstruction {
    const data = INSTRUCTION_DISCRIMINATORS.close_vault;

    return new TransactionInstruction({
      keys: [
        { pubkey: vaultPDA, isSigner: false, isWritable: true },
        { pubkey: owner, isSigner: true, isWritable: true },
      ],
      programId: this.programId,
      data,
    });
  }

  /**
   * Generate ownership hash from wallet secret
   * This is a simplified version - production would use ZK proof
   */
  generateOwnershipHash(
    walletAddress: string,
    ipfsCid: string,
    timestamp: number
  ): Uint8Array {
    const data = `${walletAddress}:${ipfsCid}:${timestamp}`;
    const hash = sha256(data);
    return Uint8Array.from(Buffer.from(hash, 'hex'));
  }

  /**
   * Helper: Encode string for Borsh (4-byte length + UTF-8 bytes)
   */
  private encodeString(str: string): Buffer {
    const utf8 = Buffer.from(str, 'utf8');
    const length = Buffer.alloc(4);
    length.writeUInt32LE(utf8.length, 0);
    return Buffer.concat([length, utf8]);
  }
}

/**
 * Get singleton instance
 */
let client: ZKVaultClient | null = null;

export function getZKVaultClient(connection: Connection): ZKVaultClient {
  if (!client) {
    client = new ZKVaultClient(connection);
  }
  return client;
}
