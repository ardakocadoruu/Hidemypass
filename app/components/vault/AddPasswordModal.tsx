'use client';

import { useState, FormEvent } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { PasswordGenerator } from './PasswordGenerator';
import { PasswordStrength } from './PasswordStrength';
import type { NewPasswordForm } from '../../lib/types';
import { validatePasswordForm } from '../../lib/utils';

interface AddPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (form: NewPasswordForm) => Promise<any>;
  isSaving: boolean;
}

export function AddPasswordModal({ isOpen, onClose, onAdd, isSaving }: AddPasswordModalProps) {
  const [form, setForm] = useState<NewPasswordForm>({
    website: '',
    username: '',
    password: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate
    const validation = validatePasswordForm(form);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      await onAdd(form);
      // Reset form
      setForm({ website: '', username: '', password: '', notes: '' });
      setErrors({});
      onClose();
    } catch (error: any) {
      setErrors({ general: error.message || 'Failed to add password' });
    }
  };

  const handleClose = () => {
    if (!isSaving) {
      setForm({ website: '', username: '', password: '', notes: '' });
      setErrors({});
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New Password"
      footer={
        <div className="flex gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isSaving}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex-1"
          >
            {isSaving ? 'Saving...' : 'Save Password'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.general && (
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-3 text-red-400 text-sm">
            {errors.general}
          </div>
        )}

        <Input
          label="Website"
          type="text"
          placeholder="example.com"
          value={form.website}
          onChange={(e) => setForm({ ...form, website: e.target.value })}
          error={errors.website}
          disabled={isSaving}
        />

        <Input
          label="Username / Email"
          type="text"
          placeholder="your@email.com"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          error={errors.username}
          disabled={isSaving}
        />

        <div>
          <Input
            label="Password"
            type="password"
            placeholder="Enter or generate a password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            error={errors.password}
            disabled={isSaving}
          />
          <PasswordStrength password={form.password} />
          <div className="mt-3">
            <PasswordGenerator
              onUsePassword={(password) => setForm({ ...form, password })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Notes (Optional)
          </label>
          <textarea
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            rows={3}
            placeholder="Add any notes..."
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            disabled={isSaving}
          />
          {errors.notes && <p className="mt-1 text-sm text-red-400">{errors.notes}</p>}
        </div>
      </form>
    </Modal>
  );
}
