'use client';

import { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useWallet } from '@solana/wallet-adapter-react';
import { Navbar } from './components/layout/Navbar';
import { WalletSelectionModal } from './components/wallet/WalletSelectionModal';
import { ScrollReveal } from './components/animations/ScrollReveal';
import { V3SecuritySection } from './components/sections/V3SecuritySection';
import {
  Lock,
  Shield,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Code2,
  Database,
  Key,
  Globe,
  Zap
} from 'lucide-react';

export default function Home() {
  const { connected } = useWallet();
  const [showWalletModal, setShowWalletModal] = useState(false);

  return (
    <>
      <Head>
        <title>HideMyPass - Enterprise Zero-Knowledge Password Manager | Light Protocol</title>
        <meta name="description" content="Secure your digital identity with HideMyPass. Enterprise-grade password management powered by Light Protocol ZK Compression. 99.1% cheaper, 100% private, fully decentralized." />
        <meta name="keywords" content="zero-knowledge, password manager, zk compression, light protocol, solana, web3, decentralized, privacy, encryption, AES-256-GCM" />
        <meta property="og:title" content="HideMyPass - Enterprise Zero-Knowledge Password Manager" />
        <meta property="og:description" content="99.1% cheaper. 100% private. Built on Light Protocol ZK Compression." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://hidemypass.io" />
      </Head>

      <div className="min-h-screen text-white overflow-hidden">
        <Navbar />

        {/* Hero Section - Ultra Clean */}
        <section className="relative min-h-screen flex items-center justify-center px-4">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-transparent to-transparent pointer-events-none" />

          <div className="relative max-w-6xl mx-auto text-center py-20">
            {/* Powered By Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
              {/* Solana Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-transparent border border-purple-500/20 rounded-full text-sm backdrop-blur-sm hover:border-purple-500/40 transition-all duration-300">
                <svg width="16" height="16" viewBox="0 0 397.7 311.7" className="flex-shrink-0">
                  <defs>
                    <linearGradient id="solana-gradient" x1="360.9" y1="351.5" x2="141.2" y2="131.8" gradientUnits="userSpaceOnUse">
                      <stop offset="0" stopColor="#00ffa3"/>
                      <stop offset="1" stopColor="#dc1fff"/>
                    </linearGradient>
                  </defs>
                  <path fill="url(#solana-gradient)" d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z"/>
                  <path fill="url(#solana-gradient)" d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z"/>
                  <path fill="url(#solana-gradient)" d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z"/>
                </svg>
                <span className="text-gray-300 font-medium">POWERED BY</span>
                <span className="text-purple-400 font-bold">SOLANA</span>
              </div>

              {/* Light Protocol Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/20 rounded-full text-sm backdrop-blur-sm hover:border-blue-500/40 transition-all duration-300">
                <svg width="16" height="16" viewBox="0 0 400 400" className="flex-shrink-0">
                  <defs>
                    <linearGradient id="light-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#60a5fa"/>
                      <stop offset="100%" stopColor="#06b6d4"/>
                    </linearGradient>
                  </defs>
                  <circle cx="200" cy="200" r="180" fill="none" stroke="url(#light-gradient)" strokeWidth="20" opacity="0.3"/>
                  <circle cx="200" cy="200" r="120" fill="none" stroke="url(#light-gradient)" strokeWidth="20" opacity="0.5"/>
                  <circle cx="200" cy="200" r="60" fill="url(#light-gradient)"/>
                  <path d="M200 40 L200 100 M200 300 L200 360 M40 200 L100 200 M300 200 L360 200" stroke="url(#light-gradient)" strokeWidth="15" strokeLinecap="round"/>
                </svg>
                <span className="text-gray-300 font-medium">POWERED BY</span>
                <span className="text-blue-400 font-bold">LIGHT PROTOCOL</span>
              </div>
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm mb-8 backdrop-blur-sm">
              <div className="w-2 h-2 bg-purple-400 rounded-full" style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
              <span className="text-gray-400 font-medium">Zero-Knowledge Password Manager</span>
            </div>

            {/* Headline */}
            <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tight leading-[1.1]">
              <span className="block text-white mb-2">Secure Your</span>
              <span className="block bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Digital Identity
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-4 leading-relaxed">
              Enterprise-grade password management powered by Light Protocol ZK Compression.
            </p>
            <p className="text-2xl md:text-3xl font-semibold mb-12">
              <span className="text-purple-400">99.1% cheaper.</span>{' '}
              <span className="text-blue-400">100% private.</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              {connected ? (
                <Link
                  href="/vault"
                  className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 inline-flex items-center gap-2"
                >
                  <Lock className="w-5 h-5" />
                  Open My Vault
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <button
                  onClick={() => setShowWalletModal(true)}
                  className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 inline-flex items-center gap-2"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              )}

              <Link
                href="/docs"
                className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-semibold text-lg hover:bg-white/10 transition-all duration-300 inline-flex items-center gap-2"
              >
                <Code2 className="w-5 h-5" />
                Documentation
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-8 text-sm text-gray-500 flex-wrap">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>AES-256-GCM</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>~$0.0005/vault</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Decentralized</span>
              </div>
            </div>
          </div>
        </section>
        <V3SecuritySection />


        {/* Key Metrics - Clean Dashboard */}
        <section className="py-24 px-4 border-t border-white/5">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Metric 1 */}
                <ScrollReveal delay={100}>
                  <div className="group bg-gradient-to-br from-purple-600/10 to-transparent border border-purple-500/20 rounded-3xl p-8 hover:border-purple-500/40 transition-all duration-300">
                <div className="text-5xl font-bold text-white mb-2">99.1%</div>
                <div className="text-gray-400 mb-4 font-medium">Cost Reduction</div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-purple-400 font-mono font-semibold">15k lamports</span>
                  <span className="text-gray-600">vs</span>
                  <span className="text-gray-600 line-through font-mono">1.6M</span>
                </div>
                  </div>
                </ScrollReveal>

                {/* Metric 2 */}
                <ScrollReveal delay={200}>
                  <div className="group bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/20 rounded-3xl p-8 hover:border-blue-500/40 transition-all duration-300">
                <div className="text-5xl font-bold text-white mb-2">~400ms</div>
                <div className="text-gray-400 mb-4 font-medium">Transaction Time</div>
                <div className="text-sm text-blue-400 font-medium">Solana + Light Protocol</div>
                  </div>
                </ScrollReveal>

                {/* Metric 3 */}
                <ScrollReveal delay={300}>
                  <div className="group bg-gradient-to-br from-cyan-600/10 to-transparent border border-cyan-500/20 rounded-3xl p-8 hover:border-cyan-500/40 transition-all duration-300">
                <div className="text-5xl font-bold text-white mb-2">128b</div>
                <div className="text-gray-400 mb-4 font-medium">ZK Proof Size</div>
                    <div className="text-sm text-cyan-400 font-medium">Groth16 Auto-Generated</div>
                  </div>
                </ScrollReveal>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Technology Stack - Premium Cards */}
        <section className="py-32 px-4 border-t border-white/5 bg-gradient-to-b from-transparent to-purple-900/10">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-20">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600/10 border border-purple-500/20 rounded-full text-sm text-purple-400 mb-6 font-medium">
                  <Sparkles className="w-4 h-4" />
                  Technology
                </div>
                <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
                  Built on <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Best-in-Class</span> Infrastructure
                </h2>
              </div>
            </ScrollReveal>

            <div className="space-y-6">
              {/* Light Protocol */}
              <ScrollReveal delay={100}>
                <div className="group bg-gradient-to-r from-purple-600/10 to-transparent border border-purple-500/20 rounded-3xl p-8 md:p-10 hover:border-purple-500/40 transition-all duration-300">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="w-20 h-20 bg-purple-600/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Zap className="w-10 h-10 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-3">Light Protocol ZK Compression</h3>
                    <p className="text-gray-400 text-lg mb-4 leading-relaxed">
                      Zero-knowledge state compression for Solana. Merkle tree-based account compression with automatic Groth16 proof generation via Helius RPC.
                    </p>
                    <div className="flex gap-3 flex-wrap">
                      <span className="px-4 py-2 bg-purple-600/20 rounded-xl text-sm text-purple-300 font-mono font-semibold">99.1% cheaper</span>
                      <span className="px-4 py-2 bg-purple-600/20 rounded-xl text-sm text-purple-300 font-mono font-semibold">Rent-free</span>
                      <span className="px-4 py-2 bg-purple-600/20 rounded-xl text-sm text-purple-300 font-mono font-semibold">~200k CU</span>
                    </div>
                  </div>
                </div>
                </div>
              </ScrollReveal>

              {/* Security */}
              <ScrollReveal delay={200}>
                <div className="group bg-gradient-to-r from-blue-600/10 to-transparent border border-blue-500/20 rounded-3xl p-8 md:p-10 hover:border-blue-500/40 transition-all duration-300">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="w-20 h-20 bg-blue-600/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Shield className="w-10 h-10 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-3">AES-256-GCM Encryption</h3>
                    <p className="text-gray-400 text-lg mb-4 leading-relaxed">
                      Military-grade authenticated encryption with 300,000 PBKDF2 iterations. Keys derived from wallet signatures via HKDF. Never stored, never transmitted.
                    </p>
                    <div className="flex gap-3 flex-wrap">
                      <span className="px-4 py-2 bg-blue-600/20 rounded-xl text-sm text-blue-300 font-mono font-semibold">256-bit</span>
                      <span className="px-4 py-2 bg-blue-600/20 rounded-xl text-sm text-blue-300 font-mono font-semibold">AEAD</span>
                      <span className="px-4 py-2 bg-blue-600/20 rounded-xl text-sm text-blue-300 font-mono font-semibold">Client-side</span>
                    </div>
                  </div>
                </div>
                </div>
              </ScrollReveal>

              {/* IPFS */}
              <ScrollReveal delay={300}>
                <div className="group bg-gradient-to-r from-cyan-600/10 to-transparent border border-cyan-500/20 rounded-3xl p-8 md:p-10 hover:border-cyan-500/40 transition-all duration-300">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="w-20 h-20 bg-cyan-600/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Globe className="w-10 h-10 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-3">Decentralized Storage</h3>
                    <p className="text-gray-400 text-lg mb-4 leading-relaxed">
                      IPFS + Pinata for encrypted vault data. Content-addressed, immutable, accessible from anywhere. Zero encrypted data on-chain.
                    </p>
                    <div className="flex gap-3 flex-wrap">
                      <span className="px-4 py-2 bg-cyan-600/20 rounded-xl text-sm text-cyan-300 font-mono font-semibold">IPFS CID</span>
                      <span className="px-4 py-2 bg-cyan-600/20 rounded-xl text-sm text-cyan-300 font-mono font-semibold">Pinned</span>
                      <span className="px-4 py-2 bg-cyan-600/20 rounded-xl text-sm text-cyan-300 font-mono font-semibold">Global</span>
                    </div>
                  </div>
                </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Why Choose - Feature List */}
        <section className="py-32 px-4 border-t border-white/5">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-20">
                <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
                  Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">HideMyPass</span>
                </h2>
              </div>
            </ScrollReveal>

            <div className="space-y-6">
              <ScrollReveal delay={100}>
                <div className="group flex items-start gap-6 p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-purple-500/30 hover:bg-white/10 transition-all duration-300">
                  <div className="w-3 h-3 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">True Zero-Knowledge Architecture</h3>
                    <p className="text-gray-400 leading-relaxed">
                      Your encryption keys are derived from your wallet signature and never leave your browser. Not even we can access your passwords.
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={200}>
                <div className="group flex items-start gap-6 p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-blue-500/30 hover:bg-white/10 transition-all duration-300">
                  <div className="w-3 h-3 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">99.1% Cost Reduction</h3>
                    <p className="text-gray-400 leading-relaxed">
                      Light Protocol's ZK Compression reduces storage costs from ~1.6M lamports to ~15k lamports. Same security, fraction of the cost.
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={300}>
                <div className="group flex items-start gap-6 p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-cyan-500/30 hover:bg-white/10 transition-all duration-300">
                  <div className="w-3 h-3 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Fully Decentralized</h3>
                    <p className="text-gray-400 leading-relaxed">
                      IPFS for storage, Solana for state, Light Protocol for compression. No centralized servers, no single point of failure.
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={400}>
                <div className="group flex items-start gap-6 p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-green-500/30 hover:bg-white/10 transition-all duration-300">
                  <div className="w-3 h-3 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Audited Infrastructure</h3>
                    <p className="text-gray-400 leading-relaxed">
                      Built on Light Protocol's audited system programs and Solana's battle-tested infrastructure. Production-ready from day one.
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-32 px-4 border-t border-white/5">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                Secure your digital identity with zero-knowledge privacy. No credit card required.
              </p>

            {connected ? (
              <Link
                href="/vault"
                className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl font-bold text-xl hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300"
              >
                <Lock className="w-6 h-6" />
                Open My Vault
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <button
                onClick={() => setShowWalletModal(true)}
                className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl font-bold text-xl hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            )}

            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-500">
              <Link href="/docs" className="hover:text-purple-400 transition-colors font-medium">
                Documentation
              </Link>
              <a href="https://www.zkcompression.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors font-medium">
                Light Protocol
              </a>
              <a href="https://github.com/Lightprotocol/light-protocol" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors font-medium">
                GitHub
              </a>
            </div>
            </div>
          </ScrollReveal>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3">
                <svg width="40" height="40" viewBox="0 0 48 48">
                  <defs>
                    <linearGradient id="footer-logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="50%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                  <path d="M24 4 L38 13 L38 31 L24 40 L10 31 L10 13 Z"
                        fill="url(#footer-logo-gradient)"
                        opacity="0.9"/>
                  <g transform="translate(24, 24)">
                    <rect x="-6" y="0" width="12" height="10" rx="2" fill="white" opacity="0.95"/>
                    <path d="M -4,-6 Q -4,-10 0,-10 Q 4,-10 4,-6"
                          stroke="white"
                          strokeWidth="2.5"
                          fill="none"
                          strokeLinecap="round"
                          opacity="0.95"/>
                    <circle cx="0" cy="4" r="1.5" fill="url(#footer-logo-gradient)"/>
                    <rect x="-0.5" y="5" width="1" height="3" fill="url(#footer-logo-gradient)"/>
                  </g>
                </svg>
                <div>
                  <span className="text-lg font-bold text-white">HideMyPass</span>
                  <p className="text-xs text-gray-500">Powered by Light Protocol</p>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                © 2025 HideMyPass • Enterprise Security • Open Source
              </div>
            </div>
          </div>
        </footer>

        {/* Wallet Selection Modal */}
        <WalletSelectionModal
          isOpen={showWalletModal}
          onClose={() => setShowWalletModal(false)}
        />
      </div>
    </>
  );
}
