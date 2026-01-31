/**
 * Light Protocol ZK Compression Client
 *
 * Provides RPC connection to Light Protocol for:
 * - Compressed account operations
 * - ZK proof generation (automatic via Helius RPC)
 * - Merkle tree state management
 */

import { createRpc, Rpc } from '@lightprotocol/stateless.js';
import { Connection, PublicKey } from '@solana/web3.js';

/**
 * Network configuration for Light Protocol
 */
export type LightNetwork = 'devnet' | 'mainnet';

interface LightClientConfig {
  network: LightNetwork;
  heliusApiKey?: string;
}

/**
 * Light Protocol RPC client wrapper
 */
export class LightClient {
  private rpc: Rpc;
  private network: LightNetwork;

  constructor(config: LightClientConfig) {
    this.network = config.network;

    const rpcUrl = this.getRpcUrl(config.network, config.heliusApiKey);

    // Create Light Protocol RPC client
    // Both parameters are the same URL for standard Helius setup
    this.rpc = createRpc(rpcUrl, rpcUrl);
  }

  /**
   * Get the configured RPC instance
   */
  getRpc(): Rpc {
    return this.rpc;
  }

  /**
   * Get the network being used
   */
  getNetwork(): LightNetwork {
    return this.network;
  }

  /**
   * Check if Light Protocol indexer is healthy
   */
  async checkHealth(): Promise<boolean> {
    try {
      const slot = await this.rpc.getSlot();
      const health = await this.rpc.getIndexerHealth(slot);
      return health === 'Ok';
    } catch (error) {
      console.error('Light Protocol health check failed:', error);
      return false;
    }
  }

  /**
   * Get current slot number
   */
  async getSlot(): Promise<number> {
    return this.rpc.getSlot();
  }

  /**
   * Get RPC URL based on network
   */
  private getRpcUrl(network: LightNetwork, apiKey?: string): string {
    const key = apiKey || process.env.NEXT_PUBLIC_HELIUS_API_KEY || 'your-api-key';

    if (network === 'mainnet') {
      return `https://mainnet.helius-rpc.com/?api-key=${key}`;
    } else {
      return `https://devnet.helius-rpc.com/?api-key=${key}`;
    }
  }
}

/**
 * Singleton instance for browser usage
 */
let clientInstance: LightClient | null = null;

/**
 * Get or create Light Protocol client instance
 */
export function getLightClient(config?: LightClientConfig): LightClient {
  if (!clientInstance) {
    const network = (process.env.NEXT_PUBLIC_SOLANA_NETWORK as LightNetwork) || 'devnet';
    clientInstance = new LightClient(config || { network });
  }
  return clientInstance;
}

/**
 * Reset client instance (useful for testing or network switching)
 */
export function resetLightClient(): void {
  clientInstance = null;
}

/**
 * Helper to get standard Solana Connection from Light RPC
 */
export function getConnectionFromLightRpc(rpc: Rpc): Connection {
  // Light RPC extends Connection, but we create a new one for compatibility
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet';
  const heliusKey = process.env.NEXT_PUBLIC_HELIUS_API_KEY || 'your-api-key';

  const endpoint = network === 'mainnet'
    ? `https://mainnet.helius-rpc.com/?api-key=${heliusKey}`
    : `https://devnet.helius-rpc.com/?api-key=${heliusKey}`;

  return new Connection(endpoint, 'confirmed');
}
