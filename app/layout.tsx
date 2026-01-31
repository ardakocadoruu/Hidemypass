import type { Metadata } from 'next';
import './globals.css';
import { WalletProvider } from './components/providers/WalletProvider';
import { APP_NAME, APP_DESCRIPTION } from './lib/constants';

export const metadata: Metadata = {
  title: {
    default: APP_NAME + ' - Zero-Knowledge Password Vault on Solana',
    template: `%s | ${APP_NAME}`
  },
  description: APP_DESCRIPTION,
  keywords: [
    'password manager',
    'zero knowledge',
    'blockchain password vault',
    'solana',
    'decentralized password manager',
    'web3 security',
    'encrypted password storage',
    'light protocol',
    'ZK compression',
    'privacy',
    'password security',
    'multi-layer encryption',
    'wallet-based authentication'
  ],
  authors: [{ name: 'HideMyPass Team' }],
  creator: 'HideMyPass',
  publisher: 'HideMyPass',
  metadataBase: new URL('https://hidemypass.xyz'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://hidemypass.xyz',
    title: APP_NAME + ' - Zero-Knowledge Password Vault',
    description: APP_DESCRIPTION,
    siteName: APP_NAME,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'HideMyPass - Military-grade password security'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: APP_NAME + ' - Zero-Knowledge Password Vault',
    description: APP_DESCRIPTION,
    images: ['/og-image.png'],
    creator: '@hidemypass'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
      },
    ],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#a855f7" />
      </head>
      <body>
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
