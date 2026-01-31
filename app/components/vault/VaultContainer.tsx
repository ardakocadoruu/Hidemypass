'use client';

import { useState, useEffect, useMemo } from 'react';
import { useZKVault } from '../../hooks/useZKVault';
import { PasswordList } from './PasswordList';
import { AddPasswordModal } from './AddPasswordModal';
import { SearchBar } from './SearchBar';
import { EmptyState } from './EmptyState';
import { VaultUnlock } from './VaultUnlock';
import { BlockchainSuccess } from './BlockchainSuccess';
import { Button } from '../ui/Button';
import { Skeleton } from '../ui/Skeleton';

export function VaultContainer() {
  const {
    isLoading,
    isInitialized,
    isVaultSaving,
    error,
    passwords,
    addPassword,
    updatePassword,
    deletePassword,
  } = useZKVault();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [prevSaving, setPrevSaving] = useState(false);

  // Computed properties
  const passwordCount = passwords.length;
  const isEmpty = passwordCount === 0;

  // Search function
  const searchPasswords = (query: string) => {
    if (!query.trim()) return passwords;

    const lowerQuery = query.toLowerCase();
    return passwords.filter(
      p =>
        p.title.toLowerCase().includes(lowerQuery) ||
        p.username.toLowerCase().includes(lowerQuery) ||
        p.url?.toLowerCase().includes(lowerQuery)
    );
  };

  // Detect when saving completes successfully
  useEffect(() => {
    if (prevSaving && !isVaultSaving && !error) {
      setShowSuccess(true);
    }
    setPrevSaving(isVaultSaving);
  }, [isVaultSaving, prevSaving, error]);

  // Filtered passwords
  const filteredPasswords = searchPasswords(searchQuery);

  // Loading state with unlock animation
  if (isLoading || !isInitialized) {
    return <VaultUnlock />;
  }

  // Error state
  if (error && !isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Vault Initialization Failed</h3>
          <p className="text-red-400 mb-6 text-sm leading-relaxed">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">My Vault</h2>
          <p className="text-gray-500 mt-1.5">
            {passwordCount} {passwordCount === 1 ? 'password' : 'passwords'} securely stored
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          disabled={isVaultSaving}
          className="group relative overflow-hidden bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="relative z-10 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Password
          </span>
        </button>
      </div>

      {/* Search */}
      {!isEmpty && (
        <div className="mb-6">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search passwords (website, username...)"
          />
        </div>
      )}

      {/* Content */}
      {isEmpty ? (
        <EmptyState onAddClick={() => setIsAddModalOpen(true)} />
      ) : filteredPasswords.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          No results found for "{searchQuery}"
        </div>
      ) : (
        <PasswordList
          passwords={filteredPasswords}
          onUpdate={updatePassword}
          onDelete={deletePassword}
          isSaving={isVaultSaving}
        />
      )}

      {/* Add Password Modal */}
      <AddPasswordModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addPassword}
        isSaving={isVaultSaving}
      />

      {/* Saving indicator */}
      {isVaultSaving && (
        <div className="fixed bottom-6 right-6 glass backdrop-blur-xl border-purple-500/30 text-white px-5 py-3 rounded-2xl flex items-center gap-3 shadow-2xl shadow-purple-500/20 animate-fade-in">
          <svg className="animate-spin h-5 w-5 text-purple-400" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span className="font-medium">Saving to blockchain...</span>
        </div>
      )}

      {/* Success animation */}
      <BlockchainSuccess
        show={showSuccess}
        onComplete={() => setShowSuccess(false)}
      />
    </div>
  );
}

function VaultSkeleton() {
  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>
      <Skeleton className="h-10 w-full mb-6" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    </div>
  );
}
