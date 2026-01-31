'use client';

import Link from 'next/link';
import { Navbar } from '../components/layout/Navbar';
import {
  Lock,
  Book,
  Terminal,
  Lightbulb,
  CheckCircle,
  Copy,
  ExternalLink,
  Package,
  Layers,
  Cpu,
  Shield,
  Sparkles,
  Code2,
  Database,
  Zap,
  ArrowRight,
  Key,
  Cloud,
  Server,
  FileKey,
  Fingerprint,
  Globe,
  GitBranch
} from 'lucide-react';
import { useState } from 'react';

export default function Documentation() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl mb-6">
            <Book className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Documentation
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Complete technical guide to ZK Password Vault with Light Protocol ZK Compression,
            military-grade AES-256-GCM encryption, and decentralized IPFS storage.
          </p>

          <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
            <span className="px-4 py-2 bg-purple-600/20 border border-purple-500/30 rounded-full text-sm text-purple-300 font-medium">
              Light Protocol
            </span>
            <span className="px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-full text-sm text-blue-300 font-medium">
              Helius RPC
            </span>
            <span className="px-4 py-2 bg-cyan-600/20 border border-cyan-500/30 rounded-full text-sm text-cyan-300 font-medium">
              Pinata IPFS
            </span>
            <span className="px-4 py-2 bg-green-600/20 border border-green-500/30 rounded-full text-sm text-green-300 font-medium">
              AES-256-GCM
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-strong rounded-2xl p-6 sticky top-24">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-400" />
                Contents
              </h3>
              <nav className="space-y-2">
                {[
                  { href: '#overview', label: 'Overview' },
                  { href: '#architecture', label: 'Architecture' },
                  { href: '#encryption', label: 'Encryption (AES-256)' },
                  { href: '#lightprotocol', label: 'Light Protocol ZK' },
                  { href: '#helius', label: 'Helius RPC' },
                  { href: '#ipfs', label: 'IPFS (Pinata)' },
                  { href: '#security', label: 'Security Model' },
                  { href: '#quickstart', label: 'Quick Start' },
                ].map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="block text-gray-400 hover:text-white transition-colors text-sm py-1"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            {/* Overview Section */}
            <section id="overview" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600/20 to-purple-600/10 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                </div>
                <h2 className="text-3xl font-bold text-white">Overview</h2>
              </div>

              <div className="glass rounded-2xl p-8 border border-gray-800">
                <p className="text-gray-300 leading-relaxed mb-6">
                  ZK Password Vault is a next-generation password manager built on Solana blockchain
                  using <span className="text-purple-400 font-semibold">Light Protocol ZK Compression</span>.
                  Your passwords are encrypted client-side, stored on decentralized IPFS, and verified
                  on-chain with zero-knowledge proofs.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="w-5 h-5 text-purple-400" />
                      <span className="font-semibold text-white">Military-Grade Encryption</span>
                    </div>
                    <p className="text-gray-400 text-sm">AES-256-GCM with PBKDF2 key derivation (600,000 iterations)</p>
                  </div>

                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-5 h-5 text-cyan-400" />
                      <span className="font-semibold text-white">99.1% Cheaper Storage</span>
                    </div>
                    <p className="text-gray-400 text-sm">Light Protocol ZK Compression reduces on-chain costs dramatically</p>
                  </div>

                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Cloud className="w-5 h-5 text-blue-400" />
                      <span className="font-semibold text-white">Decentralized Storage</span>
                    </div>
                    <p className="text-gray-400 text-sm">Encrypted data on IPFS via Pinata, only CID reference on-chain</p>
                  </div>

                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-5 h-5 text-green-400" />
                      <span className="font-semibold text-white">Self-Custody</span>
                    </div>
                    <p className="text-gray-400 text-sm">Only you can decrypt - wallet signature derives encryption key</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Architecture Section */}
            <section id="architecture" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600/20 to-blue-600/10 rounded-xl flex items-center justify-center">
                  <GitBranch className="w-6 h-6 text-blue-400" />
                </div>
                <h2 className="text-3xl font-bold text-white">Architecture</h2>
              </div>

              <div className="glass rounded-2xl p-8 border border-gray-800">
                <div className="bg-gray-900 rounded-xl p-6 font-mono text-sm overflow-x-auto">
                  <pre className="text-gray-300">{`┌─────────────────────────────────────────────────────────────────────────┐
│                        ZK PASSWORD VAULT ARCHITECTURE                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐              │
│  │   CLIENT     │    │   BACKEND    │    │   SOLANA     │              │
│  │   (Browser)  │    │   (Next.js)  │    │   (Devnet)   │              │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘              │
│         │                    │                   │                       │
│    ┌────▼────┐          ┌────▼────┐        ┌────▼────┐                 │
│    │ AES-256 │          │ Light   │        │ ZK Comp │                 │
│    │ Encrypt │          │ Protocol│        │ Account │                 │
│    └────┬────┘          │ SDK     │        └─────────┘                 │
│         │               └────┬────┘                                     │
│    ┌────▼────┐               │                                          │
│    │ IPFS    │◄──────────────┘                                         │
│    │ Upload  │     (Helius RPC)                                         │
│    └────┬────┘                                                          │
│         │                                                                │
│    ┌────▼────┐                                                          │
│    │ Pinata  │                                                          │
│    │ Gateway │                                                          │
│    └─────────┘                                                          │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘`}</pre>
                </div>

                <div className="mt-6 space-y-4">
                  <h3 className="text-xl font-semibold text-white">Data Flow</h3>
                  <ol className="space-y-3 text-gray-300">
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                      <span><strong>Encrypt:</strong> Passwords encrypted client-side with AES-256-GCM</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                      <span><strong>Upload:</strong> Encrypted blob uploaded to IPFS via Pinata</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                      <span><strong>Compress:</strong> Backend prepares Light Protocol ZK Compression transaction</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                      <span><strong>Sign:</strong> Client signs transaction with wallet (keys never leave device)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold">5</span>
                      <span><strong>Submit:</strong> Signed transaction broadcast to Solana via Helius RPC</span>
                    </li>
                  </ol>
                </div>
              </div>
            </section>

            {/* Encryption Section */}
            <section id="encryption" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600/20 to-green-600/10 rounded-xl flex items-center justify-center">
                  <FileKey className="w-6 h-6 text-green-400" />
                </div>
                <h2 className="text-3xl font-bold text-white">Encryption (AES-256-GCM)</h2>
              </div>

              <div className="glass rounded-2xl p-8 border border-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                      <Key className="w-5 h-5 text-yellow-400" />
                      Key Derivation
                    </h3>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span><strong>Algorithm:</strong> PBKDF2-SHA256</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span><strong>Iterations:</strong> 300,000</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span><strong>Input:</strong> Wallet Ed25519 signature</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span><strong>Output:</strong> 256-bit AES key</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                      <Lock className="w-5 h-5 text-purple-400" />
                      Encryption
                    </h3>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span><strong>Algorithm:</strong> AES-256-GCM</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span><strong>Nonce:</strong> 12-byte random (crypto.getRandomValues)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span><strong>Auth Tag:</strong> 128-bit integrity verification</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span><strong>Output:</strong> Base64 encoded ciphertext</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gray-900 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">Encryption Flow</span>
                  </div>
                  <pre className="text-sm text-gray-300 overflow-x-auto">{`// Key Derivation
signature = wallet.signMessage("ZK-Vault-Encryption-Key-v1")
key = PBKDF2(signature, salt, 300000, "SHA-256") // Vault key
passwordKey = PBKDF2(signature, salt2, 300000, "SHA-256") // Per-password

// Triple Encryption (600,000 total iterations)
nonce = crypto.getRandomValues(12 bytes)
ciphertext = AES-256-GCM.encrypt(passwords_json, key, nonce)
output = base64(nonce || ciphertext || auth_tag)`}</pre>
                </div>

                <div className="mt-6 p-4 bg-green-600/10 border border-green-500/20 rounded-xl">
                  <p className="text-green-300 text-sm">
                    <strong>🔐 Security Note:</strong> AES-256-GCM is the same encryption used by banks,
                    governments, and military. With 2^256 possible keys, brute-force attacks are computationally
                    impossible - it would take billions of years with all computers on Earth.
                  </p>
                </div>
              </div>
            </section>

            {/* Light Protocol Section */}
            <section id="lightprotocol" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600/20 to-purple-600/10 rounded-xl flex items-center justify-center">
                  <Cpu className="w-6 h-6 text-purple-400" />
                </div>
                <h2 className="text-3xl font-bold text-white">Light Protocol ZK Compression</h2>
              </div>

              <div className="glass rounded-2xl p-8 border border-gray-800">
                <p className="text-gray-300 leading-relaxed mb-6">
                  <a href="https://www.zkcompression.com" target="_blank" rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 underline">
                    Light Protocol
                  </a> uses zero-knowledge proofs (Groth16/Poseidon) to compress on-chain state,
                  reducing storage costs by 99.1% while maintaining full verifiability.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-purple-600/10 border border-purple-500/20 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-purple-400">99.1%</div>
                    <div className="text-gray-400 text-sm">Cost Reduction</div>
                  </div>
                  <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-blue-400">~5000</div>
                    <div className="text-gray-400 text-sm">Lamports (~$0.0005)</div>
                  </div>
                  <div className="bg-cyan-600/10 border border-cyan-500/20 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-cyan-400">Rent-Free</div>
                    <div className="text-gray-400 text-sm">No Storage Rent</div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-white mb-4">Programs Used</h3>
                <div className="space-y-3 font-mono text-sm">
                  <div className="bg-gray-900 rounded-lg p-3 flex items-center justify-between">
                    <span className="text-gray-400">Light System Program</span>
                    <span className="text-purple-400">SySTEM1eSU2p4BGQfQpimFEWWSC1XDFeun3Nqzz3rT7</span>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-3 flex items-center justify-between">
                    <span className="text-gray-400">Account Compression</span>
                    <span className="text-blue-400">compr6CUsB5m2jS4Y3831ztGSTnDpnKJTKS95d64XVq</span>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-3 flex items-center justify-between">
                    <span className="text-gray-400">Noop Program</span>
                    <span className="text-cyan-400">noopb9bkMVfRPU8AsbpTUg8AQkHtKwMYZiFUjNRtMmV</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-purple-600/10 border border-purple-500/20 rounded-xl">
                  <p className="text-purple-300 text-sm">
                    <strong>⚡ ZK Compression:</strong> Data is stored in compressed Merkle trees with Poseidon
                    hashes. Validity proofs (Groth16) ensure only legitimate updates are accepted.
                  </p>
                </div>
              </div>
            </section>

            {/* Helius Section */}
            <section id="helius" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-600/20 to-orange-600/10 rounded-xl flex items-center justify-center">
                  <Server className="w-6 h-6 text-orange-400" />
                </div>
                <h2 className="text-3xl font-bold text-white">Helius RPC</h2>
              </div>

              <div className="glass rounded-2xl p-8 border border-gray-800">
                <p className="text-gray-300 leading-relaxed mb-6">
                  <a href="https://helius.dev" target="_blank" rel="noopener noreferrer"
                    className="text-orange-400 hover:text-orange-300 underline">
                    Helius
                  </a> provides enterprise-grade Solana RPC with native ZK Compression support.
                  Their infrastructure handles the complex cryptographic operations required for
                  Light Protocol transactions.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-orange-600/10 border border-orange-500/20 rounded-xl p-4">
                    <h4 className="font-semibold text-orange-300 mb-2">ZK Compression API</h4>
                    <p className="text-gray-400 text-sm">
                      Native support for getStateTreeInfos(), getValidityProof(), and compressed account operations.
                    </p>
                  </div>
                  <div className="bg-orange-600/10 border border-orange-500/20 rounded-xl p-4">
                    <h4 className="font-semibold text-orange-300 mb-2">High Availability</h4>
                    <p className="text-gray-400 text-sm">
                      99.9% uptime SLA with global edge network for low-latency transactions.
                    </p>
                  </div>
                </div>

                <div className="mt-6 bg-gray-900 rounded-xl p-4 font-mono text-sm">
                  <span className="text-gray-500"># RPC Endpoint</span>
                  <br />
                  <span className="text-orange-400">https://devnet.helius-rpc.com/?api-key=YOUR_KEY</span>
                </div>
              </div>
            </section>

            {/* IPFS Section */}
            <section id="ipfs" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-600/20 to-cyan-600/10 rounded-xl flex items-center justify-center">
                  <Cloud className="w-6 h-6 text-cyan-400" />
                </div>
                <h2 className="text-3xl font-bold text-white">IPFS Storage (Pinata)</h2>
              </div>

              <div className="glass rounded-2xl p-8 border border-gray-800">
                <p className="text-gray-300 leading-relaxed mb-6">
                  <a href="https://pinata.cloud" target="_blank" rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 underline">
                    Pinata
                  </a> provides reliable IPFS pinning for encrypted vault data. Content-addressing
                  ensures data integrity - if the CID matches, the data is authentic.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-cyan-600/10 border border-cyan-500/20 rounded-xl p-4 text-center">
                    <Database className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                    <div className="text-white font-semibold">Decentralized</div>
                    <div className="text-gray-400 text-xs">No single point of failure</div>
                  </div>
                  <div className="bg-cyan-600/10 border border-cyan-500/20 rounded-xl p-4 text-center">
                    <Fingerprint className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                    <div className="text-white font-semibold">Content-Addressed</div>
                    <div className="text-gray-400 text-xs">CID verifies integrity</div>
                  </div>
                  <div className="bg-cyan-600/10 border border-cyan-500/20 rounded-xl p-4 text-center">
                    <Globe className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                    <div className="text-white font-semibold">Global CDN</div>
                    <div className="text-gray-400 text-xs">Fast downloads worldwide</div>
                  </div>
                </div>

                <div className="p-4 bg-cyan-600/10 border border-cyan-500/20 rounded-xl">
                  <p className="text-cyan-300 text-sm">
                    <strong>🔒 Privacy:</strong> Only encrypted ciphertext is stored on IPFS. Without your
                    wallet's encryption key, the data is meaningless random bytes.
                  </p>
                </div>
              </div>
            </section>

            {/* Security Model Section */}
            <section id="security" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600/20 to-red-600/10 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-red-400" />
                </div>
                <h2 className="text-3xl font-bold text-white">Security Model</h2>
              </div>

              <div className="glass rounded-2xl p-8 border border-gray-800">
                <h3 className="text-xl font-semibold text-white mb-4">4 Layers of Protection</h3>

                <div className="space-y-4 mb-8">
                  <div className="bg-gray-800/50 rounded-xl p-4 border-l-4 border-purple-500">
                    <h4 className="font-semibold text-purple-300">Layer 1: Client-Side Encryption</h4>
                    <p className="text-gray-400 text-sm mt-1">
                      AES-256-GCM encryption happens in your browser. Passwords never leave your device unencrypted.
                    </p>
                  </div>

                  <div className="bg-gray-800/50 rounded-xl p-4 border-l-4 border-blue-500">
                    <h4 className="font-semibold text-blue-300">Layer 2: Wallet-Derived Keys</h4>
                    <p className="text-gray-400 text-sm mt-1">
                      Encryption key is derived from your wallet signature. Only you can decrypt.
                    </p>
                  </div>

                  <div className="bg-gray-800/50 rounded-xl p-4 border-l-4 border-cyan-500">
                    <h4 className="font-semibold text-cyan-300">Layer 3: Off-Chain Storage</h4>
                    <p className="text-gray-400 text-sm mt-1">
                      Encrypted data stored on IPFS, not blockchain. Only CID reference is on-chain.
                    </p>
                  </div>

                  <div className="bg-gray-800/50 rounded-xl p-4 border-l-4 border-green-500">
                    <h4 className="font-semibold text-green-300">Layer 4: ZK Verification</h4>
                    <p className="text-gray-400 text-sm mt-1">
                      Light Protocol ZK proofs verify ownership without revealing any data.
                    </p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-white mb-4">Attack Resistance</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 text-gray-400">Attack Vector</th>
                        <th className="text-center py-3 text-gray-400">Protected?</th>
                        <th className="text-left py-3 text-gray-400">How?</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-300">
                      <tr className="border-b border-gray-800">
                        <td className="py-3">Brute-force encryption</td>
                        <td className="text-center py-3"><span className="text-green-400">✓</span></td>
                        <td className="py-3 text-gray-400">AES-256 = 2^256 combinations</td>
                      </tr>
                      <tr className="border-b border-gray-800">
                        <td className="py-3">Server breach</td>
                        <td className="text-center py-3"><span className="text-green-400">✓</span></td>
                        <td className="py-3 text-gray-400">Backend never sees encryption keys</td>
                      </tr>
                      <tr className="border-b border-gray-800">
                        <td className="py-3">IPFS data leak</td>
                        <td className="text-center py-3"><span className="text-green-400">✓</span></td>
                        <td className="py-3 text-gray-400">Data is encrypted, unusable without key</td>
                      </tr>
                      <tr className="border-b border-gray-800">
                        <td className="py-3">Man-in-the-middle</td>
                        <td className="text-center py-3"><span className="text-green-400">✓</span></td>
                        <td className="py-3 text-gray-400">HTTPS + client-side encryption</td>
                      </tr>
                      <tr>
                        <td className="py-3">Wallet key theft</td>
                        <td className="text-center py-3"><span className="text-yellow-400">⚠</span></td>
                        <td className="py-3 text-gray-400">Use hardware wallet for maximum security</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Quick Start Section */}
            <section id="quickstart" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600/20 to-green-600/10 rounded-xl flex items-center justify-center">
                  <Terminal className="w-6 h-6 text-green-400" />
                </div>
                <h2 className="text-3xl font-bold text-white">Quick Start</h2>
              </div>

              <div className="glass rounded-2xl p-8 border border-gray-800">
                <ol className="space-y-6">
                  <li className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center font-bold">1</span>
                    <div>
                      <h4 className="font-semibold text-white">Connect Your Wallet</h4>
                      <p className="text-gray-400 text-sm mt-1">
                        Click "Connect Wallet" and approve with Phantom, Solflare, or any Solana wallet.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center font-bold">2</span>
                    <div>
                      <h4 className="font-semibold text-white">Sign to Derive Key</h4>
                      <p className="text-gray-400 text-sm mt-1">
                        One-time signature to derive your unique encryption key. This happens locally.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center font-bold">3</span>
                    <div>
                      <h4 className="font-semibold text-white">Add Passwords</h4>
                      <p className="text-gray-400 text-sm mt-1">
                        Add your credentials. Use the password generator for strong passwords.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center font-bold">4</span>
                    <div>
                      <h4 className="font-semibold text-white">Save with ZK Compression</h4>
                      <p className="text-gray-400 text-sm mt-1">
                        Click save, approve the transaction (~$0.001), and your vault is secured on-chain!
                      </p>
                    </div>
                  </li>
                </ol>

                <div className="mt-8 text-center">
                  <Link
                    href="/vault"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold px-8 py-4 rounded-xl transition-all hover:scale-105"
                  >
                    <Lock className="w-5 h-5" />
                    Open Vault
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          <p>Built with Light Protocol, Helius, Pinata & Solana</p>
          <p className="mt-2">© 2025 ZK Password Vault • Privacy Hack</p>
        </div>
      </footer>
    </div>
  );
}
