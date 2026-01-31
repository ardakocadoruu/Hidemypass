'use client';

import { useState } from 'react';
import { X, Lock, Shield, AlertCircle } from 'lucide-react';
import { validateMasterPassword } from '../../lib/crypto/master-password';

interface MasterPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (password: string) => void;
  mode: 'setup' | 'unlock';
}

export function MasterPasswordModal({
  isOpen,
  onClose,
  mode,
  onSubmit,
}: MasterPasswordModalProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (mode === 'setup') {
      // Validate password strength
      const validation = validateMasterPassword(password);
      if (!validation.valid) {
        setErrors(validation.errors);
        return;
      }

      // Check confirmation
      if (password !== confirmPassword) {
        setErrors(['Passwords do not match']);
        return;
      }
    }

    onSubmit(password);
    setPassword('');
    setConfirmPassword('');
    setErrors([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative bg-gradient-to-br from-gray-900 to-black border border-purple-500/30 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Icon */}
        <div className="flex items-center justify-center w-16 h-16 bg-purple-600/20 rounded-2xl mb-6 mx-auto">
          {mode === 'setup' ? (
            <Shield className="w-8 h-8 text-purple-400" />
          ) : (
            <Lock className="w-8 h-8 text-purple-400" />
          )}
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white text-center mb-2">
          {mode === 'setup' ? 'Setup Master Password' : 'Enter Master Password'}
        </h2>

        <p className="text-gray-400 text-center mb-6 text-sm">
          {mode === 'setup'
            ? 'Additional security layer: Even if your wallet is compromised, your passwords stay safe.'
            : 'Enter your master password to decrypt your vault.'}
        </p>

        {/* Password Input */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Master Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                placeholder="Enter master password"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {mode === 'setup' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                placeholder="Confirm master password"
              />
            </div>
          )}
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                {errors.map((error, i) => (
                  <p key={i} className="text-sm text-red-400">
                    {error}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Requirements (setup mode only) */}
        {mode === 'setup' && (
          <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <p className="text-sm text-blue-400 font-medium mb-2">Requirements:</p>
            <ul className="text-xs text-blue-300 space-y-1">
              <li>• At least 8 characters</li>
              <li>• One uppercase letter</li>
              <li>• One lowercase letter</li>
              <li>• One number</li>
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!password || (mode === 'setup' && !confirmPassword)}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mode === 'setup' ? 'Set Password' : 'Unlock Vault'}
          </button>
        </div>

        {/* Info */}
        <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
          <p className="text-xs text-purple-300 text-center">
            <Lock className="w-3 h-3 inline mr-1" />
            Your master password is never stored or transmitted. It only exists in your memory.
          </p>
        </div>
      </div>
    </div>
  );
}
