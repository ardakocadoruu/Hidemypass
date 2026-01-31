'use client';

import { useState } from 'react';
import type { PasswordEntry, NewPasswordForm } from '../../lib/types';
import { PasswordCard } from './PasswordCard';

interface PasswordListProps {
  passwords: PasswordEntry[];
  onUpdate: (id: string, updates: Partial<NewPasswordForm>) => Promise<PasswordEntry>;
  onDelete: (id: string) => Promise<void>;
  isSaving: boolean;
}

export function PasswordList({ passwords, onUpdate, onDelete, isSaving }: PasswordListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleEdit = (id: string) => {
    setEditingId(id);
    // TODO: Open edit modal
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this password?')) {
      setDeletingId(id);
      try {
        await onDelete(id);
      } catch (error) {
        alert('Failed to delete password');
      }
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {passwords.map((password) => (
        <PasswordCard
          key={password.id}
          password={password}
          onEdit={() => handleEdit(password.id)}
          onDelete={() => handleDelete(password.id)}
        />
      ))}
    </div>
  );
}
