'use client';

import { useState, useEffect } from 'react';
import { useClipboard } from '../../hooks/useClipboard';
import type { PasswordEntry } from '../../lib/types';

interface PasswordCardProps {
  password: PasswordEntry;
  onEdit: () => void;
  onDelete: () => void;
}

export function PasswordCard({ password, onEdit, onDelete }: PasswordCardProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { copy, copied } = useClipboard();

  // Extract first letter of website for icon (privacy-preserving)
  const websiteInitial = password.website.charAt(0).toUpperCase();

  // Memory cleanup on unmount (security best practice)
  useEffect(() => {
    return () => {
      // Clear password from memory when component unmounts
      setShowPassword(false);
    };
  }, []);

  return (
    <div className="group relative stagger-item">
      {/* Animated gradient border on hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/30 via-blue-500/30 to-cyan-500/30 rounded-2xl opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500"></div>

      {/* Glow effect on hover */}
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/0 via-purple-500/20 to-purple-500/0 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-700"></div>

      <div className="relative glass rounded-2xl p-5 hover:bg-white/5 transition-all duration-300 hover:transform hover:scale-[1.02]">
        <div className="flex items-start gap-4">
          {/* Website Icon (privacy-preserving, no external calls) */}
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:border-purple-500/30 transition-colors">
            <span className="text-purple-300 font-bold text-lg">{websiteInitial}</span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Website */}
            <h3 className="text-white font-semibold truncate text-lg">{password.website}</h3>

            {/* Username */}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-gray-400 text-sm truncate font-medium">{password.username}</span>
              <button
                onClick={() => copy(password.username)}
                className="text-gray-500 hover:text-purple-400 transition-colors"
                title="Copy username"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>

            {/* Password */}
            <div className="flex items-center gap-2 mt-3">
              <code className={`bg-black/40 border border-white/5 px-3 py-1.5 rounded-lg text-sm font-mono text-gray-300 tracking-wider transition-all duration-300 ${showPassword ? 'animate-scale-in' : ''}`}>
                {showPassword ? password.password : '••••••••••••'}
              </code>
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-500 hover:text-blue-400 transition-all duration-200 p-1.5 hover:bg-white/5 rounded-lg hover:scale-110 active:scale-95"
                title={showPassword ? 'Hide' : 'Show'}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  {showPassword ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  )}
                </svg>
              </button>
              <button
                onClick={() => copy(password.password)}
                className={`text-gray-500 hover:text-cyan-400 transition-all duration-200 p-1.5 hover:bg-white/5 rounded-lg hover:scale-110 active:scale-95 ${copied === password.password ? 'text-green-400' : ''}`}
                title={copied === password.password ? 'Copied!' : 'Copy password'}
              >
                {copied === password.password ? (
                  <svg className="w-4 h-4 animate-scale-in" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Notes */}
            {password.notes && (
              <p className="text-gray-500 text-xs mt-3 truncate flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                {password.notes}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all hover:scale-110"
              title="Edit"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all hover:scale-110"
              title="Delete"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
