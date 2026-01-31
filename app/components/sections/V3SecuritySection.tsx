'use client';

import { Shield, Lock, Layers, Key, CheckCircle2, Zap, Award, Users, Database } from 'lucide-react';
import { ScrollReveal } from '../animations/ScrollReveal';

export function V3SecuritySection() {
  return (
    <section className="relative py-32 px-4 bg-gradient-to-b from-black via-purple-950/5 to-black">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-full mb-6">
              <Shield className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-gray-300">V3 Architecture</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Military-Grade
              </span>
              <br />
              <span className="text-white">Multi-Layer Security</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Defense-in-depth architecture with vault-level metadata encryption and per-password isolation.
              <br />
              Your passwords are protected by multiple independent encryption layers.
            </p>
          </div>
        </ScrollReveal>

        {/* How It Works - Data Flow Visualization */}
        <div className="mb-32 overflow-hidden relative">
          {/* Background gradient effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/5 via-transparent to-blue-900/5 pointer-events-none" />

          <div className="relative">
            <ScrollReveal>
              <div className="text-center mb-24">
                <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
                  How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Works</span>
                </h2>
                <p className="text-xl text-gray-400">
                  End-to-end encryption with zero-knowledge proofs
                </p>
              </div>
            </ScrollReveal>

            {/* Interactive Flow Diagram */}
            <ScrollReveal delay={0.2}>
              <div className="relative">

                {/* Desktop: Horizontal Flow */}
                <div className="hidden lg:block">
                  <div className="flex items-center justify-between gap-12">

                    {/* Step 1: Your Browser */}
                    <div className="flex-1">
                      <div className="relative">
                        {/* Animated border */}
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-purple-400 rounded-2xl opacity-20" />

                        <div className="relative bg-black border border-purple-500/30 rounded-2xl p-8">
                          <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-600 rounded-xl mb-4">
                              <span className="text-lg font-bold">1</span>
                            </div>
                            <h3 className="text-xl font-bold text-white">Your Browser</h3>
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-start gap-3">
                              <Key className="w-5 h-5 text-purple-400 flex-shrink-0 mt-1" />
                              <div>
                                <div className="text-sm font-semibold text-white mb-1">AES-256-GCM</div>
                                <div className="text-xs text-gray-400">Client-side encryption with wallet-derived key</div>
                              </div>
                            </div>

                            <div className="border-t border-gray-800 pt-4">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500">Input</span>
                                <span className="text-gray-400 font-mono">plaintext</span>
                              </div>
                              <div className="flex items-center justify-between text-xs mt-2">
                                <span className="text-gray-500">Output</span>
                                <span className="text-purple-400 font-mono">encrypted</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Arrow 1 */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-24 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500" />
                      <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                      </svg>
                      <div className="text-xs text-gray-500 font-mono">HTTPS</div>
                    </div>

                    {/* Step 2: IPFS Network */}
                    <div className="flex-1">
                      <div className="relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl opacity-20" />

                        <div className="relative bg-black border border-blue-500/30 rounded-2xl p-8">
                          <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl mb-4">
                              <span className="text-lg font-bold">2</span>
                            </div>
                            <h3 className="text-xl font-bold text-white">IPFS Network</h3>
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-start gap-3">
                              <Database className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                              <div>
                                <div className="text-sm font-semibold text-white mb-1">Pinata Gateway</div>
                                <div className="text-xs text-gray-400">Decentralized storage with content addressing</div>
                              </div>
                            </div>

                            <div className="border-t border-gray-800 pt-4">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500">Stored</span>
                                <span className="text-blue-400 font-mono">encrypted blob</span>
                              </div>
                              <div className="flex items-center justify-between text-xs mt-2">
                                <span className="text-gray-500">Returns</span>
                                <span className="text-cyan-400 font-mono">CID hash</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Arrow 2 */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-24 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500" />
                      <svg className="w-6 h-6 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                      </svg>
                      <div className="text-xs text-gray-500 font-mono">zkSNARK</div>
                    </div>

                    {/* Step 3: Solana */}
                    <div className="flex-1">
                      <div className="relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-2xl opacity-20" />

                        <div className="relative bg-black border border-cyan-500/30 rounded-2xl p-8">
                          <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-cyan-600 rounded-xl mb-4">
                              <span className="text-lg font-bold">3</span>
                            </div>
                            <h3 className="text-xl font-bold text-white">Solana L1</h3>
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-start gap-3">
                              <Shield className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                              <div>
                                <div className="text-sm font-semibold text-white mb-1">ZK Compression</div>
                                <div className="text-xs text-gray-400">Groth16 proof with compressed PDA</div>
                              </div>
                            </div>

                            <div className="border-t border-gray-800 pt-4">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500">On-chain</span>
                                <span className="text-cyan-400 font-mono">128 bytes</span>
                              </div>
                              <div className="flex items-center justify-between text-xs mt-2">
                                <span className="text-gray-500">Cost</span>
                                <span className="text-green-400 font-mono">-99.1%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Security Guarantees - Bottom Row */}
                  <div className="mt-12 flex items-center justify-center gap-8">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                      <span className="text-gray-400">Zero server access</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                      <span className="text-gray-400">Cryptographic proofs</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                      <span className="text-gray-400">Rent-free storage</span>
                    </div>
                  </div>
                </div>

                {/* Mobile: Vertical Stack */}
                <div className="lg:hidden space-y-8">
                  {/* Mobile Step 1 */}
                  <div className="relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-purple-400 rounded-2xl opacity-20" />
                    <div className="relative bg-black border border-purple-500/30 rounded-2xl p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-purple-600 rounded-xl">
                          <span className="font-bold">1</span>
                        </div>
                        <h3 className="text-lg font-bold text-white">Your Browser</h3>
                      </div>
                      <div className="flex items-start gap-3">
                        <Key className="w-5 h-5 text-purple-400 flex-shrink-0 mt-1" />
                        <div>
                          <div className="text-sm font-semibold text-white mb-1">AES-256-GCM Encryption</div>
                          <div className="text-xs text-gray-400">Client-side with wallet-derived key</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z" />
                    </svg>
                  </div>

                  {/* Mobile Step 2 */}
                  <div className="relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl opacity-20" />
                    <div className="relative bg-black border border-blue-500/30 rounded-2xl p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-xl">
                          <span className="font-bold">2</span>
                        </div>
                        <h3 className="text-lg font-bold text-white">IPFS Network</h3>
                      </div>
                      <div className="flex items-start gap-3">
                        <Database className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                        <div>
                          <div className="text-sm font-semibold text-white mb-1">Pinata Gateway</div>
                          <div className="text-xs text-gray-400">Decentralized storage</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <svg className="w-8 h-8 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z" />
                    </svg>
                  </div>

                  {/* Mobile Step 3 */}
                  <div className="relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-2xl opacity-20" />
                    <div className="relative bg-black border border-cyan-500/30 rounded-2xl p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-cyan-600 rounded-xl">
                          <span className="font-bold">3</span>
                        </div>
                        <h3 className="text-lg font-bold text-white">Solana L1</h3>
                      </div>
                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                        <div>
                          <div className="text-sm font-semibold text-white mb-1">ZK Compression</div>
                          <div className="text-xs text-gray-400">Groth16 proof, 99.1% cheaper</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Two-Layer Architecture */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <ScrollReveal delay={0.2}>
            <div className="glass-card p-8 rounded-3xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 group">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-4 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl group-hover:scale-110 transition-transform">
                  <Lock className="w-8 h-8 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Layer 1: Vault-Level Key</h3>
                  <p className="text-purple-400 font-mono text-sm">300k PBKDF2 iterations</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Deterministic encryption key derived from your wallet signature. Encrypts vault container, CID, and all metadata fields.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">Encrypts: Titles, Usernames, URLs, Notes</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">Same key every reconnect (deterministic)</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">Memory-only storage (never persisted)</span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="glass-card p-8 rounded-3xl border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 group">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl group-hover:scale-110 transition-transform">
                  <Key className="w-8 h-8 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Layer 2: Per-Password Key</h3>
                  <p className="text-blue-400 font-mono text-sm">150k PBKDF2 iterations</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Unique encryption key for each password. Generated from password ID + timestamp. Complete isolation between passwords.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">Encrypts: Password field only</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">Unique key per password (isolated)</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">On-demand decryption (signature required)</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Why Choose HideMyPass */}
        <ScrollReveal delay={0.4}>
          <div className="glass-card p-10 rounded-3xl border border-purple-500/20">
            <div className="flex items-center gap-3 mb-8">
              <Award className="w-6 h-6 text-purple-400" />
              <h3 className="text-2xl font-bold text-white">Why Choose HideMyPass?</h3>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-gradient-to-br from-purple-500/5 to-transparent rounded-2xl border border-purple-500/20">
                <Shield className="w-8 h-8 text-purple-400 mb-4" />
                <h4 className="text-lg font-bold text-white mb-3">Maximum Privacy</h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Every piece of data is encrypted - even metadata like titles and usernames. Nothing is visible in plaintext, ensuring complete privacy.
                </p>
              </div>

              <div className="p-6 bg-gradient-to-br from-blue-500/5 to-transparent rounded-2xl border border-blue-500/20">
                <Zap className="w-8 h-8 text-blue-400 mb-4" />
                <h4 className="text-lg font-bold text-white mb-3">Lightning Fast</h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Powered by Solana blockchain and Light Protocol. Instant access to your passwords with 99.1% lower costs than traditional solutions.
                </p>
              </div>

              <div className="p-6 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-2xl border border-cyan-500/20">
                <Users className="w-8 h-8 text-cyan-400 mb-4" />
                <h4 className="text-lg font-bold text-white mb-3">No Master Password</h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Forget master passwords! Use your crypto wallet for authentication. More secure, easier to use, and impossible to forget.
                </p>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-cyan-500/5 border border-purple-500/20 rounded-2xl">
              <div className="flex items-start gap-4">
                <Shield className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-lg font-bold text-white mb-2">Defense-in-Depth Protection</h4>
                  <p className="text-gray-400 leading-relaxed">
                    HideMyPass uses multiple independent encryption layers working together. Each password is protected by its own unique key,
                    and all metadata is encrypted separately. This multi-layer approach ensures maximum security for all your sensitive data.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
