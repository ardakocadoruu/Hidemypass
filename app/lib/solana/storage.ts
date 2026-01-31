/**
 * Simple Solana Memo-based Storage
 * Stores encrypted data in transaction memos - ultra cheap!
 */

import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
  SystemProgram,
} from '@solana/web3.js';
import { getConnection } from './connection';

const MEMO_PROGRAM_ID = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr');

/**
 * Save encrypted vault data using memo (very cheap - only signature fee)
 */
export async function saveVaultMemo(
  owner: PublicKey,
  encryptedData: string,
  signTransaction: (tx: Transaction) => Promise<Transaction>
): Promise<string> {
  const connection = getConnection();

  // Create memo instruction with encrypted data
  const memoInstruction = new TransactionInstruction({
    keys: [],
    programId: MEMO_PROGRAM_ID,
    data: Buffer.from(`VAULT:${encryptedData}`, 'utf-8'),
  });

  // Add tiny SOL transfer to make it a valid transaction
  const transferInstruction = SystemProgram.transfer({
    fromPubkey: owner,
    toPubkey: owner, // Send to self
    lamports: 1, // 0.000000001 SOL
  });

  const tx = new Transaction().add(transferInstruction, memoInstruction);

  const { blockhash } = await connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  tx.feePayer = owner;

  const signed = await signTransaction(tx);
  const signature = await connection.sendRawTransaction(signed.serialize());

  await connection.confirmTransaction(signature);

  return signature;
}

/**
 * Load vault data from transaction memos
 */
export async function loadVaultMemo(owner: PublicKey): Promise<string | null> {
  try {
    const connection = getConnection();

    // Add timeout to prevent hanging
    const timeoutPromise = new Promise<null>((resolve) =>
      setTimeout(() => resolve(null), 10000) // 10 second timeout
    );

    const loadPromise = (async () => {
      const signatures = await connection.getSignaturesForAddress(owner, { limit: 20 }); // Reduced from 100 to 20

      // Search in reverse order (most recent first)
      for (const sig of signatures) {
        try {
          const tx = await connection.getTransaction(sig.signature, {
            maxSupportedTransactionVersion: 0,
          });

          if (!tx?.meta?.logMessages) continue;

          for (const log of tx.meta.logMessages) {
            if (log.includes('VAULT:')) {
              const match = log.match(/VAULT:(.+)"/);
              if (match) {
                return match[1];
              }
            }
          }
        } catch (err) {
          // Skip failed transaction fetches
          console.warn('Failed to fetch transaction:', sig.signature);
          continue;
        }
      }

      return null;
    })();

    return await Promise.race([loadPromise, timeoutPromise]);
  } catch (error) {
    console.error('Error loading vault from Solana:', error);
    return null; // Return null for new users or on error
  }
}
