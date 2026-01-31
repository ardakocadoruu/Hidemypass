/**
 * useZkProof Hook
 *
 * React hook for generating and verifying zero-knowledge proofs
 * Proves wallet ownership without revealing private keys
 */

import { useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { poseidonHash2 } from '../lib/zk/poseidon';
import { generateOwnershipProof, verifyProofLocally } from '../lib/zk/proof';

export interface ZkProofState {
  isGenerating: boolean;
  isVerifying: boolean;
  proof: Uint8Array | null;
  publicInputs: string[] | null;
  error: string | null;
}

export function useZkProof() {
  const { publicKey, signMessage } = useWallet();

  const [state, setState] = useState<ZkProofState>({
    isGenerating: false,
    isVerifying: false,
    proof: null,
    publicInputs: null,
    error: null,
  });

  /**
   * Generate ZK proof of wallet ownership
   *
   * Process:
   * 1. Sign a message to derive a secret
   * 2. Hash wallet pubkey
   * 3. Compute commitment = hash(pubkey_hash, secret)
   * 4. Generate ZK proof
   * 5. Verify locally
   */
  const generateProof = useCallback(async (): Promise<{
    proof: Uint8Array;
    publicInputs: string[];
    commitment: bigint;
  } | null> => {
    if (!publicKey || !signMessage) {
      setState(prev => ({ ...prev, error: 'Wallet not connected' }));
      return null;
    }

    setState(prev => ({ ...prev, isGenerating: true, error: null }));

    try {
      console.log('🔐 Starting ZK proof generation...');

      // 1. Derive secret from wallet signature
      const message = new TextEncoder().encode(
        'ZK-Password-Vault-Ownership-Proof-v1\n\n' +
        'By signing this message, you prove ownership of this wallet.\n' +
        'This signature is used to generate a zero-knowledge proof.\n\n' +
        'No transaction will be submitted.'
      );

      console.log('📝 Requesting wallet signature...');
      const signature = await signMessage(message);

      // Hash signature to get secret (field element)
      const secretHash = await poseidonHash2(
        BigInt('0x' + Buffer.from(signature.slice(0, 31)).toString('hex')),
        BigInt('0x' + Buffer.from(signature.slice(31, 62)).toString('hex'))
      );

      console.log('✅ Secret derived from signature');

      // 2. Hash wallet pubkey
      const pubkeyBytes = publicKey.toBytes();
      const pubkeyHash = await poseidonHash2(
        BigInt('0x' + Buffer.from(pubkeyBytes.slice(0, 31)).toString('hex')),
        BigInt('0x' + Buffer.from(pubkeyBytes.slice(31)).toString('hex'))
      );

      console.log('✅ Pubkey hashed');

      // 3. Compute commitment
      const commitment = await poseidonHash2(pubkeyHash, secretHash);

      console.log('✅ Commitment computed');
      console.log('  Pubkey hash:', pubkeyHash.toString(16).slice(0, 16) + '...');
      console.log('  Commitment:', commitment.toString(16).slice(0, 16) + '...');

      // 4. Generate ZK proof
      const { proof, publicInputs } = await generateOwnershipProof({
        pubkey_hash: '0x' + pubkeyHash.toString(16),
        commitment: '0x' + commitment.toString(16),
        secret: '0x' + secretHash.toString(16),
      });

      console.log('✅ ZK proof generated');

      // 5. Verify locally
      setState(prev => ({ ...prev, isGenerating: false, isVerifying: true }));

      const isValid = await verifyProofLocally(proof, publicInputs);

      if (!isValid) {
        throw new Error('Local proof verification failed');
      }

      console.log('✅ Local verification passed');

      setState(prev => ({
        ...prev,
        isVerifying: false,
        proof,
        publicInputs,
        error: null,
      }));

      return { proof, publicInputs, commitment };

    } catch (error) {
      console.error('❌ Proof generation failed:', error);

      const errorMessage = error instanceof Error
        ? error.message
        : 'Unknown error occurred';

      setState(prev => ({
        ...prev,
        isGenerating: false,
        isVerifying: false,
        error: errorMessage,
      }));

      return null;
    }
  }, [publicKey, signMessage]);

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setState({
      isGenerating: false,
      isVerifying: false,
      proof: null,
      publicInputs: null,
      error: null,
    });
  }, []);

  return {
    ...state,
    generateProof,
    reset,
  };
}
