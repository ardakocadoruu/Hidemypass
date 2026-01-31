'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Container } from './Container';
import { APP_NAME } from '../../lib/constants';

export function Header() {
  const { connected } = useWallet();

  return (
    <header className="border-b border-white/5 glass sticky top-0 z-10 backdrop-blur-xl">
      <Container>
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-2xl blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
              <div className="relative w-11 h-11 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">{APP_NAME}</h1>
              <p className="text-xs text-gray-500 font-medium">Zero-Knowledge Security</p>
            </div>
          </div>

          {/* Wallet Button */}
          <div>
            <WalletMultiButton className="!bg-white/5 hover:!bg-white/10 !rounded-xl !border !border-white/10 !font-semibold !transition-all" />
          </div>
        </div>
      </Container>
    </header>
  );
}
