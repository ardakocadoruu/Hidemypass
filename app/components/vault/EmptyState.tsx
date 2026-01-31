'use client';

import { FC } from 'react';
import { Button } from '../ui/Button';

interface EmptyStateProps {
  onAddClick: () => void;
}

export const EmptyState: FC<EmptyStateProps> = ({ onAddClick }) => {
  return (
    <div className="text-center py-20">
      <div className="relative mx-auto mb-8 w-20 h-20">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-3xl blur-2xl"></div>
        <div className="relative glass border border-white/10 rounded-3xl flex items-center justify-center w-20 h-20">
          <svg
            className="w-10 h-10 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
      </div>
      <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Your vault is empty</h3>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">
        Start securing your digital life by adding your first password to the blockchain
      </p>
      <button
        onClick={onAddClick}
        className="group relative overflow-hidden bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 text-white px-8 py-4 rounded-xl font-semibold transition-all hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30"
      >
        <span className="relative z-10 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Your First Password
        </span>
      </button>
    </div>
  );
};
