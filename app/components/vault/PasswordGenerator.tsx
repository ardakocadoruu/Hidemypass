'use client';

import { useState } from 'react';
import { usePasswordGenerator } from '../../hooks/usePasswordGenerator';
import { Button } from '../ui/Button';
import { evaluatePasswordStrength } from '../../lib/utils';

interface PasswordGeneratorProps {
  onUsePassword: (password: string) => void;
}

export function PasswordGenerator({ onUsePassword }: PasswordGeneratorProps) {
  const { options, generatedPassword, generate, updateOptions } = usePasswordGenerator();
  const [isOpen, setIsOpen] = useState(false);

  const handleGenerate = () => {
    generate();
    if (!isOpen) setIsOpen(true);
  };

  const handleUse = () => {
    if (generatedPassword) {
      onUsePassword(generatedPassword);
      setIsOpen(false);
    }
  };

  const strength = generatedPassword ? evaluatePasswordStrength(generatedPassword) : null;

  return (
    <div className="space-y-3">
      <Button type="button" variant="secondary" onClick={handleGenerate} className="w-full">
        🎲 Generate Secure Password
      </Button>

      {isOpen && (
        <div className="bg-gray-700 p-4 rounded-lg space-y-3">
          {/* Generated Password */}
          {generatedPassword && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <code className="text-sm font-mono bg-gray-800 px-3 py-2 rounded flex-1 mr-2">
                  {generatedPassword}
                </code>
                <Button type="button" size="sm" onClick={handleUse}>
                  Use
                </Button>
              </div>
              {strength && (
                <div className="text-xs text-gray-400">
                  Strength: <span style={{ color: strength.color }}>{strength.label}</span>
                </div>
              )}
            </div>
          )}

          {/* Options */}
          <div className="space-y-2">
            <div>
              <label className="text-sm text-gray-300 block mb-1">
                Length: {options.length}
              </label>
              <input
                type="range"
                min="8"
                max="64"
                value={options.length}
                onChange={(e) => updateOptions({ length: Number(e.target.value) })}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <label className="flex items-center gap-2 text-gray-300">
                <input
                  type="checkbox"
                  checked={options.includeUppercase}
                  onChange={(e) => updateOptions({ includeUppercase: e.target.checked })}
                />
                Uppercase (A-Z)
              </label>
              <label className="flex items-center gap-2 text-gray-300">
                <input
                  type="checkbox"
                  checked={options.includeLowercase}
                  onChange={(e) => updateOptions({ includeLowercase: e.target.checked })}
                />
                Lowercase (a-z)
              </label>
              <label className="flex items-center gap-2 text-gray-300">
                <input
                  type="checkbox"
                  checked={options.includeNumbers}
                  onChange={(e) => updateOptions({ includeNumbers: e.target.checked })}
                />
                Numbers (0-9)
              </label>
              <label className="flex items-center gap-2 text-gray-300">
                <input
                  type="checkbox"
                  checked={options.includeSymbols}
                  onChange={(e) => updateOptions({ includeSymbols: e.target.checked })}
                />
                Symbols (!@#$)
              </label>
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={options.excludeAmbiguous}
                onChange={(e) => updateOptions({ excludeAmbiguous: e.target.checked })}
              />
              Exclude ambiguous (0, O, l, 1, I)
            </label>
          </div>

          <Button type="button" variant="secondary" onClick={handleGenerate} className="w-full">
            Regenerate
          </Button>
        </div>
      )}
    </div>
  );
}
