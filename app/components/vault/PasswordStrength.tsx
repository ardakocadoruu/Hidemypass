'use client';

import { useMemo } from 'react';

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  const strength = useMemo(() => {
    if (!password) return { score: 0, label: '', color: '' };

    let score = 0;

    // Length check
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;

    // Complexity checks
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    // Determine strength level
    if (score <= 2) {
      return { score: 1, label: 'Weak', color: 'red' };
    } else if (score <= 4) {
      return { score: 2, label: 'Fair', color: 'orange' };
    } else if (score <= 5) {
      return { score: 3, label: 'Good', color: 'yellow' };
    } else {
      return { score: 4, label: 'Strong', color: 'green' };
    }
  }, [password]);

  if (!password) return null;

  const getColorClasses = (index: number) => {
    if (index >= strength.score) return 'bg-gray-700';

    switch (strength.color) {
      case 'red':
        return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]';
      case 'orange':
        return 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]';
      case 'yellow':
        return 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]';
      case 'green':
        return 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]';
      default:
        return 'bg-gray-700';
    }
  };

  const getLabelColor = () => {
    switch (strength.color) {
      case 'red': return 'text-red-400';
      case 'orange': return 'text-orange-400';
      case 'yellow': return 'text-yellow-400';
      case 'green': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="animate-slide-down">
      <div className="flex items-center gap-2 mt-2">
        <div className="flex-1 flex gap-1.5">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${getColorClasses(index)}`}
              style={{ animationDelay: `${index * 50}ms` }}
            />
          ))}
        </div>
        <span className={`text-xs font-semibold ${getLabelColor()} transition-colors duration-300 min-w-[50px] text-right`}>
          {strength.label}
        </span>
      </div>
    </div>
  );
}
