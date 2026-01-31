'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Lock, Menu, X, FileText, BookOpen, Github, Home, KeyRound, Layers } from 'lucide-react';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/vault', label: 'My Vault', icon: KeyRound },
    { href: '/docs', label: 'Docs', icon: FileText },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-10 transition-all duration-300 ${isScrolled
          ? 'glass-strong border-b border-purple-500/20 backdrop-blur-xl shadow-2xl shadow-purple-500/10'
          : 'bg-gradient-to-b from-black/40 to-transparent backdrop-blur-md border-b border-white/5'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                {/* Modern geometric logo */}
                <svg width="48" height="48" viewBox="0 0 48 48" className="transform group-hover:scale-105 transition-transform">
                  {/* Background glow */}
                  <defs>
                    <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="50%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Hexagon shape */}
                  <path d="M24 4 L38 13 L38 31 L24 40 L10 31 L10 13 Z"
                        fill="url(#logo-gradient)"
                        filter="url(#glow)"
                        opacity="0.9"/>

                  {/* Lock icon - simplified modern design */}
                  <g transform="translate(24, 24)">
                    {/* Lock body */}
                    <rect x="-6" y="0" width="12" height="10" rx="2" fill="white" opacity="0.95"/>
                    {/* Lock shackle */}
                    <path d="M -4,-6 Q -4,-10 0,-10 Q 4,-10 4,-6"
                          stroke="white"
                          strokeWidth="2.5"
                          fill="none"
                          strokeLinecap="round"
                          opacity="0.95"/>
                    {/* Keyhole */}
                    <circle cx="0" cy="4" r="1.5" fill="url(#logo-gradient)"/>
                    <rect x="-0.5" y="5" width="1" height="3" fill="url(#logo-gradient)"/>
                  </g>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  HideMyPass
                </span>
                <span className="text-xs text-gray-400 hidden sm:block font-medium">Zero-Knowledge Password Vault</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`group relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${active
                      ? 'text-white bg-purple-600/20 border border-purple-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              <a
                href="https://github.com/Lightprotocol/light-protocol"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
                title="Light Protocol GitHub"
              >
                <Github className="w-5 h-5" />
              </a>

              {/* Wallet Button */}
              <div className="wallet-adapter-button-trigger-wrapper">
                <WalletMultiButton />
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
        >
          <div className="glass-strong border-t border-gray-800/50 px-4 py-4 space-y-3">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active
                    ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              );
            })}

            <a
              href="https://github.com/Lightprotocol/light-protocol"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all"
            >
              <Github className="w-5 h-5" />
              <span className="font-medium">Light Protocol</span>
            </a>

            {/* Mobile Wallet Button */}
            <div className="pt-3">
              <WalletMultiButton style={{ width: '100%' }} />
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-16 sm:h-20" />
    </>
  );
}
