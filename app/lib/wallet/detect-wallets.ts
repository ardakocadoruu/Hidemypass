/**
 * Wallet Detection Utility
 *
 * Detects installed Solana wallets in the browser
 * Supports: Phantom, Solflare, Backpack, and other wallet adapters
 */

export interface DetectedWallet {
  name: string;
  icon: string;
  isInstalled: boolean;
  adapter: string;
}

/**
 * Check if Phantom wallet is installed
 */
export function isPhantomInstalled(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(window as any).phantom?.solana?.isPhantom;
}

/**
 * Check if Solflare wallet is installed
 */
export function isSolflareInstalled(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(window as any).solflare?.isSolflare;
}

/**
 * Check if Backpack wallet is installed
 */
export function isBackpackInstalled(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(window as any).backpack?.isBackpack;
}

/**
 * Check if Glow wallet is installed
 */
export function isGlowInstalled(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(window as any).glow;
}

/**
 * Check if Trust Wallet is installed
 */
export function isTrustInstalled(): boolean {
  if (typeof window === 'undefined') return false;
  const trustWallet = (window as any).trustwallet;
  return !!(trustWallet && trustWallet.solana);
}

/**
 * Detect all installed Solana wallets
 */
export function detectInstalledWallets(): DetectedWallet[] {
  const wallets: DetectedWallet[] = [
    {
      name: 'Phantom',
      icon: 'https://phantom.app/img/phantom-favicon.svg',
      isInstalled: isPhantomInstalled(),
      adapter: 'phantom',
    },
    {
      name: 'Solflare',
      icon: 'https://solflare.com/favicon.ico',
      isInstalled: isSolflareInstalled(),
      adapter: 'solflare',
    },
    {
      name: 'Backpack',
      icon: 'https://backpack.app/favicon.ico',
      isInstalled: isBackpackInstalled(),
      adapter: 'backpack',
    },
    {
      name: 'Glow',
      icon: 'https://glow.app/favicon.ico',
      isInstalled: isGlowInstalled(),
      adapter: 'glow',
    },
    {
      name: 'Trust Wallet',
      icon: 'https://trustwallet.com/assets/images/favicon.ico',
      isInstalled: isTrustInstalled(),
      adapter: 'trust',
    },
  ];

  return wallets;
}

/**
 * Get only installed wallets
 */
export function getInstalledWallets(): DetectedWallet[] {
  return detectInstalledWallets().filter(wallet => wallet.isInstalled);
}

/**
 * Get count of installed wallets
 */
export function getInstalledWalletCount(): number {
  return getInstalledWallets().length;
}

/**
 * Get recommended wallet (first installed, or Phantom if none)
 */
export function getRecommendedWallet(): DetectedWallet | null {
  const installed = getInstalledWallets();
  if (installed.length > 0) {
    return installed[0];
  }
  return null;
}

/**
 * Check if any Solana wallet is installed
 */
export function hasAnyWallet(): boolean {
  return getInstalledWalletCount() > 0;
}

/**
 * Get wallet installation URLs
 */
export const WALLET_INSTALL_URLS = {
  phantom: 'https://phantom.app/download',
  solflare: 'https://solflare.com/download',
  backpack: 'https://backpack.app/download',
  glow: 'https://glow.app',
  trust: 'https://trustwallet.com/download',
} as const;

/**
 * Get wallet name display
 */
export function getWalletDisplayName(adapter: string): string {
  const names: Record<string, string> = {
    phantom: 'Phantom',
    solflare: 'Solflare',
    backpack: 'Backpack',
    glow: 'Glow',
    trust: 'Trust Wallet',
  };
  return names[adapter] || adapter;
}
