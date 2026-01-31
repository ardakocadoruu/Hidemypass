'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Navbar } from '../components/layout/Navbar';
import { useZKVault, PasswordEntry } from '../hooks/useZKVault';
import {
    Lock,
    Plus,
    Eye,
    EyeOff,
    Copy,
    Trash2,
    Edit,
    ExternalLink,
    Shield,
    Key,
    Globe,
    User,
    FileText,
    CheckCircle,
    Loader2,
    AlertCircle,
    Sparkles,
} from 'lucide-react';

export default function VaultPage() {
    const router = useRouter();
    const { connected, publicKey } = useWallet();
    const {
        passwords,
        isLoading,
        isSaving,
        error,
        initializeVault,
        addPassword,
        deletePassword,
        updatePassword,
        decryptPasswordEntry,
        decryptPasswordMetadata,
    } = useZKVault();

    const [showAddModal, setShowAddModal] = useState(false);
    const [editingPassword, setEditingPassword] = useState<PasswordEntry | null>(null);
    const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());
    const [decryptedPasswords, setDecryptedPasswords] = useState<Map<string, string>>(new Map());
    const [decryptedMetadata, setDecryptedMetadata] = useState<Map<string, { title?: string; username?: string; url?: string; notes?: string }>>(new Map());
    const [decryptingIds, setDecryptingIds] = useState<Set<string>>(new Set());
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [newPassword, setNewPassword] = useState({
        title: '',
        username: '',
        password: '',
        url: '',
        notes: '',
    });

    // Initialize vault when wallet connects
    useEffect(() => {
        if (connected && publicKey) {
            initializeVault();
        }
    }, [connected, publicKey, initializeVault]);

    // Decrypt metadata for all V3 passwords when they load
    useEffect(() => {
        const decryptAllMetadata = async () => {
            for (const entry of passwords) {
                if (entry.encryptionVersion === 3 && !decryptedMetadata.has(entry.id)) {
                    try {
                        const metadata = await decryptPasswordMetadata(entry);
                        setDecryptedMetadata(prev => new Map(prev).set(entry.id, metadata));
                    } catch (error) {
                        console.error(`Failed to decrypt metadata for ${entry.id}:`, error);
                    }
                }
            }
        };

        if (passwords.length > 0 && decryptPasswordMetadata) {
            decryptAllMetadata();
        }
    }, [passwords, decryptPasswordMetadata]);

    const togglePasswordVisibility = async (id: string) => {
        const newVisible = new Set(visiblePasswords);
        if (newVisible.has(id)) {
            // Hide password
            newVisible.delete(id);
            setVisiblePasswords(newVisible);
        } else {
            // Show password - decrypt if not already decrypted
            const entry = passwords.find(p => p.id === id);
            if (!entry) return;

            // If not already decrypted, decrypt it now
            if (!decryptedPasswords.has(id)) {
                try {
                    setDecryptingIds(prev => new Set(prev).add(id));
                    const decrypted = await decryptPasswordEntry(entry);
                    setDecryptedPasswords(prev => new Map(prev).set(id, decrypted));
                    setDecryptingIds(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(id);
                        return newSet;
                    });
                } catch (error) {
                    console.error('Failed to decrypt password:', error);
                    setDecryptingIds(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(id);
                        return newSet;
                    });
                    return;
                }
            }

            newVisible.add(id);
            setVisiblePasswords(newVisible);
        }
    };

    const copyToClipboard = async (id: string) => {
        const entry = passwords.find(p => p.id === id);
        if (!entry) return;

        try {
            // Decrypt password if not already decrypted
            let password = decryptedPasswords.get(id);
            if (!password) {
                setDecryptingIds(prev => new Set(prev).add(id));
                password = await decryptPasswordEntry(entry);
                setDecryptedPasswords(prev => new Map(prev).set(id, password!));
                setDecryptingIds(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(id);
                    return newSet;
                });
            }

            await navigator.clipboard.writeText(password);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (error) {
            console.error('Failed to copy password:', error);
            setDecryptingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
            });
        }
    };

    const generatePassword = () => {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
        let password = '';
        for (let i = 0; i < 16; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setNewPassword({ ...newPassword, password });
    };

    // Helper: Get metadata (decrypted for V3, plaintext for V1/V2)
    const getMetadata = (entry: PasswordEntry) => {
        if (entry.encryptionVersion === 3) {
            return decryptedMetadata.get(entry.id) || {
                title: 'Decrypting...',
                username: 'Decrypting...',
                url: undefined,
                notes: undefined,
            };
        }
        return {
            title: entry.title,
            username: entry.username,
            url: entry.url,
            notes: entry.notes,
        };
    };

    const getPasswordStrength = (password: string) => {
        const strength =
            (password.length >= 8 ? 1 : 0) +
            (/[A-Z]/.test(password) ? 1 : 0) +
            (/[0-9]/.test(password) ? 1 : 0) +
            (/[^A-Za-z0-9]/.test(password) ? 1 : 0);
        return strength;
    };

    const handleAddPassword = async () => {
        if (!newPassword.title || !newPassword.password) return;

        await addPassword({
            title: newPassword.title,
            username: newPassword.username,
            password: newPassword.password,
            url: newPassword.url,
            notes: newPassword.notes,
        });

        setNewPassword({ title: '', username: '', password: '', url: '', notes: '' });
        setShowAddModal(false);
    };

    const handleDeletePassword = async (id: string) => {
        if (confirm('Are you sure you want to delete this password?')) {
            await deletePassword(id);
        }
    };

    // Not connected - show connect wallet prompt
    if (!connected) {
        return (
            <div className="min-h-screen">
                <Navbar />
                <div className="max-w-4xl mx-auto px-4 py-24">
                    <div className="glass-strong rounded-3xl p-12 text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Lock className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-4">
                            Connect Your Wallet
                        </h1>
                        <p className="text-xl text-gray-400 mb-8 max-w-lg mx-auto">
                            Connect your Solana wallet to access your encrypted password vault with ZK privacy
                        </p>
                        <div className="flex justify-center mb-6">
                            <WalletMultiButton />
                        </div>
                        <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                <span>End-to-end encrypted</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                <span>ZK Compression</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen">
                <Navbar />
                <div className="max-w-4xl mx-auto px-4 py-24">
                    <div className="glass-strong rounded-3xl p-12 text-center">
                        <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">Loading Vault</h2>
                        <p className="text-gray-400">Decrypting your passwords...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black">
            <Navbar />

            {/* Saving Overlay - Smooth & Modern */}
            {isSaving && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-md"
                    style={{
                        animation: 'fadeIn 0.2s ease-out',
                    }}
                >
                    <div
                        className="glass-strong rounded-3xl p-8 text-center max-w-md mx-4 shadow-2xl"
                        style={{
                            animation: 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                    >
                        {/* Animated Circle */}
                        <div className="relative w-24 h-24 mx-auto mb-6">
                            {/* Rotating gradient ring */}
                            <div
                                className="absolute inset-0 rounded-full"
                                style={{
                                    background: 'conic-gradient(from 0deg, transparent, #a855f7, #3b82f6, transparent)',
                                    animation: 'spin 1.5s linear infinite',
                                }}
                            />
                            {/* Inner circle with icon */}
                            <div className="absolute inset-1 rounded-full bg-gray-900 flex items-center justify-center">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                                    <Lock className="w-8 h-8 text-white" />
                                </div>
                            </div>
                        </div>

                        <h2 className="text-xl font-bold text-white mb-4">Securing Your Vault</h2>

                        {/* Progress steps */}
                        <div className="space-y-3 text-left">
                            <div className="flex items-center gap-3 text-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-purple-400" style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
                                <span className="text-gray-300">Encrypting with AES-256-GCM</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite 0.3s' }} />
                                <span className="text-gray-300">Uploading to IPFS</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite 0.6s' }} />
                                <span className="text-gray-300">Creating ZK Compressed account</span>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-700/50">
                            <p className="text-purple-400 text-xs font-medium flex items-center justify-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" style={{ animation: 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
                                Please approve the transaction in your wallet
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">My Vault</h1>
                        <p className="text-gray-400">
                            {passwords.length} password{passwords.length !== 1 ? 's' : ''} stored securely
                        </p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all hover:scale-105"
                    >
                        <Plus className="w-5 h-5" />
                        Add Password
                    </button>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="glass-strong rounded-xl p-4 mb-6 border-l-4 border-red-500">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-400" />
                            <p className="text-red-400">{error}</p>
                        </div>
                    </div>
                )}

                {/* Password List */}
                {passwords.length === 0 ? (
                    <div className="glass-strong rounded-3xl p-12 text-center">
                        <Key className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">No Passwords Yet</h2>
                        <p className="text-gray-400 mb-6">Add your first password to get started</p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            Add Your First Password
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {passwords.map((entry) => (
                            <div
                                key={entry.id}
                                className="glass-strong rounded-2xl p-6 hover:border-purple-500/30 transition-all group"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                                                <Globe className="w-5 h-5 text-purple-400" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-white">{getMetadata(entry).title}</h3>
                                                {getMetadata(entry).url && (
                                                    <a
                                                        href={getMetadata(entry).url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-gray-400 hover:text-purple-400 flex items-center gap-1"
                                                    >
                                                        {getMetadata(entry).url}
                                                        <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Username */}
                                            <div className="flex items-center gap-3 bg-black/30 rounded-lg px-4 py-3">
                                                <User className="w-4 h-4 text-gray-400" />
                                                <div className="flex-1">
                                                    <p className="text-xs text-gray-500">Username</p>
                                                    <p className="text-white font-mono">{getMetadata(entry).username || '-'}</p>
                                                </div>
                                                <button
                                                    onClick={() => navigator.clipboard.writeText(getMetadata(entry).username || '')}
                                                    className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                                >
                                                    {copiedId === `user-${entry.id}` ? (
                                                        <CheckCircle className="w-4 h-4 text-green-400" />
                                                    ) : (
                                                        <Copy className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>

                                            {/* Password */}
                                            <div className="flex items-center gap-3 bg-black/30 rounded-lg px-4 py-3">
                                                <Key className="w-4 h-4 text-gray-400" />
                                                <div className="flex-1">
                                                    <p className="text-xs text-gray-500">Password</p>
                                                    <p className="text-white font-mono">
                                                        {decryptingIds.has(entry.id) ? (
                                                            <span className="text-gray-400 flex items-center gap-2">
                                                                <Loader2 className="w-3 h-3 animate-spin inline" />
                                                                Decrypting...
                                                            </span>
                                                        ) : visiblePasswords.has(entry.id) ? (
                                                            decryptedPasswords.get(entry.id) || entry.password || '••••••••••••'
                                                        ) : (
                                                            '••••••••••••'
                                                        )}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => togglePasswordVisibility(entry.id)}
                                                    className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors disabled:opacity-50"
                                                    disabled={decryptingIds.has(entry.id)}
                                                >
                                                    {visiblePasswords.has(entry.id) ? (
                                                        <EyeOff className="w-4 h-4" />
                                                    ) : (
                                                        <Eye className="w-4 h-4" />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => copyToClipboard(entry.id)}
                                                    className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors disabled:opacity-50"
                                                    disabled={decryptingIds.has(entry.id)}
                                                >
                                                    {copiedId === `pass-${entry.id}` ? (
                                                        <CheckCircle className="w-4 h-4 text-green-400" />
                                                    ) : decryptingIds.has(entry.id) ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Copy className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Notes */}
                                        {entry.notes && (
                                            <div className="mt-3 flex items-start gap-2 text-sm text-gray-400">
                                                <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                <p>{entry.notes}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleDeletePassword(entry.id)}
                                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Password Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="relative w-full max-w-lg glass-strong rounded-2xl p-8 border border-gray-800">
                        <h2 className="text-2xl font-bold text-white mb-6">Add New Password</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    value={newPassword.title}
                                    onChange={(e) => setNewPassword({ ...newPassword, title: e.target.value })}
                                    placeholder="e.g. GitHub"
                                    className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Username / Email
                                </label>
                                <input
                                    type="text"
                                    value={newPassword.username}
                                    onChange={(e) => setNewPassword({ ...newPassword, username: e.target.value })}
                                    placeholder="user@example.com"
                                    className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Password *
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={newPassword.password}
                                        onChange={(e) => setNewPassword({ ...newPassword, password: e.target.value })}
                                        placeholder="Enter or generate password"
                                        className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 pr-24 font-mono"
                                    />
                                    <button
                                        type="button"
                                        onClick={generatePassword}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded-lg transition-colors"
                                    >
                                        Generate
                                    </button>
                                </div>
                                {/* Password Strength Indicator */}
                                {newPassword.password && (
                                    <div className="mt-2">
                                        <div className="flex gap-1 mb-1">
                                            {[1, 2, 3, 4].map((level) => {
                                                const strength = getPasswordStrength(newPassword.password);
                                                const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];
                                                return (
                                                    <div
                                                        key={level}
                                                        className={`h-1.5 flex-1 rounded-full ${level <= strength ? colors[strength - 1] : 'bg-gray-700'}`}
                                                    />
                                                );
                                            })}
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            {['Too short', 'Weak', 'Fair', 'Good', 'Strong'][getPasswordStrength(newPassword.password)]}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    URL
                                </label>
                                <input
                                    type="url"
                                    value={newPassword.url}
                                    onChange={(e) => setNewPassword({ ...newPassword, url: e.target.value })}
                                    placeholder="https://github.com"
                                    className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Notes
                                </label>
                                <textarea
                                    value={newPassword.notes}
                                    onChange={(e) => setNewPassword({ ...newPassword, notes: e.target.value })}
                                    placeholder="Additional notes..."
                                    rows={3}
                                    className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 mt-8">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="flex-1 px-6 py-3 border border-gray-700 rounded-xl text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddPassword}
                                disabled={!newPassword.title || !newPassword.password}
                                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl transition-all"
                            >
                                Save Password
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
