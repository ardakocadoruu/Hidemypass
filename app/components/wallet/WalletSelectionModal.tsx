'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletName, WalletReadyState } from '@solana/wallet-adapter-base';
import { X, CheckCircle2, Download, ExternalLink } from 'lucide-react';

interface WalletSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletSelectionModal({ isOpen, onClose }: WalletSelectionModalProps) {
  const { wallets, select, connect } = useWallet();

  if (!isOpen) return null;

  // Separate installed and not installed wallets
  const installedWallets = wallets.filter(
    (w) => w.readyState === WalletReadyState.Installed || w.readyState === WalletReadyState.Loadable
  );
  const notInstalledWallets = wallets.filter(
    (w) => w.readyState === WalletReadyState.NotDetected
  );

  const handleSelect = async (walletName: WalletName) => {
    try {
      console.log('Selecting wallet:', walletName);

      // Select the wallet first
      select(walletName);

      // Wait for adapter to initialize properly
      await new Promise(resolve => setTimeout(resolve, 500));

      // Retry logic for connection (sometimes takes 2 tries)
      let connected = false;
      let lastError = null;

      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          console.log(`Connecting to wallet (attempt ${attempt}/2)...`);
          await connect();
          console.log('Wallet connected successfully!');
          connected = true;
          break;
        } catch (err) {
          console.warn(`Connection attempt ${attempt} failed:`, err);
          lastError = err;
          if (attempt < 2) {
            await new Promise(resolve => setTimeout(resolve, 300));
          }
        }
      }

      if (connected) {
        // Close modal only after successful connection
        onClose();
      } else {
        throw lastError;
      }
    } catch (error) {
      console.error('Failed to connect wallet after retries:', error);
      // Don't close modal on error so user can try again
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-sm bg-gray-900 rounded-2xl p-6 border border-gray-800 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Connect Wallet</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Installed Wallets */}
        {installedWallets.length > 0 && (
          <div className="space-y-2 mb-4">
            {installedWallets.map((wallet) => (
              <button
                key={wallet.adapter.name}
                onClick={() => handleSelect(wallet.adapter.name as WalletName)}
                className="w-full flex items-center gap-4 p-4 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-all group border border-transparent hover:border-purple-500/30"
              >
                <img
                  src={wallet.adapter.icon}
                  alt={wallet.adapter.name}
                  className="w-10 h-10 rounded-lg"
                />
                <div className="flex-1 text-left">
                  <div className="font-medium text-white">{wallet.adapter.name}</div>
                  <div className="text-xs text-green-400">Ready to connect</div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              </button>
            ))}
          </div>
        )}

        {/* Not Installed */}
        {notInstalledWallets.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-gray-500 mb-2">Not installed</p>
            {notInstalledWallets.slice(0, 3).map((wallet) => (
              <a
                key={wallet.adapter.name}
                href={wallet.adapter.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-4 p-3 bg-gray-800/30 hover:bg-gray-800/50 rounded-xl transition-all group"
              >
                <img
                  src={wallet.adapter.icon}
                  alt={wallet.adapter.name}
                  className="w-8 h-8 rounded-lg opacity-50"
                />
                <div className="flex-1 text-left">
                  <div className="text-sm text-gray-400">{wallet.adapter.name}</div>
                </div>
                <div className="flex items-center gap-1 text-xs text-blue-400">
                  <Download className="w-3 h-3" />
                  Install
                </div>
              </a>
            ))}
          </div>
        )}

        {installedWallets.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-4">
            No wallet detected. Install Phantom or Solflare to continue.
          </p>
        )}
      </div>
    </div>
  );
}
