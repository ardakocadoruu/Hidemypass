/**
 * Solana Wallet Adapter Provider
 *
 * Wraps the app with wallet connection functionality
 */

'use client';

import { FC, ReactNode, useMemo } from 'react';
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';

// Import wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css';

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: FC<WalletProviderProps> = ({ children }) => {
  // Use Helius RPC for both devnet and mainnet (avoids rate limits from public Solana RPC)
  const endpoint = useMemo(() => {
    const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet';
    const heliusKey = process.env.NEXT_PUBLIC_HELIUS_API_KEY;

    if (heliusKey) {
      // Use Helius RPC (recommended - no rate limits)
      if (network === 'mainnet-beta') {
        return `https://mainnet.helius-rpc.com/?api-key=${heliusKey}`;
      }
      return `https://devnet.helius-rpc.com/?api-key=${heliusKey}`;
    }

    // Fallback to public RPC (has rate limits)
    return network === 'mainnet-beta'
      ? 'https://api.mainnet-beta.solana.com'
      : 'https://api.devnet.solana.com';
  }, []);

  // Initialize wallets - SIMPLE, no network param
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
};
