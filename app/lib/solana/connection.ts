/**
 * Solana Connection Configuration
 */

import { Connection, clusterApiUrl } from '@solana/web3.js';

// Get RPC URL from environment or use default
const HELIUS_RPC_URL = process.env.NEXT_PUBLIC_HELIUS_RPC_URL;
const NETWORK = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet';

/**
 * Creates and returns a Solana connection
 */
export function getConnection(): Connection {
  const endpoint = HELIUS_RPC_URL || clusterApiUrl(NETWORK as any);
  return new Connection(endpoint, 'confirmed');
}

/**
 * Returns the current network name
 */
export function getNetworkName(): string {
  return NETWORK;
}
