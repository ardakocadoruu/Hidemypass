'use client';

import { useEffect, useState } from 'react';

interface BlockchainSuccessProps {
  show: boolean;
  onComplete?: () => void;
}

export function BlockchainSuccess({ show, onComplete }: BlockchainSuccessProps) {
  const [particles, setParticles] = useState<number[]>([]);

  useEffect(() => {
    if (show) {
      // Generate particles
      setParticles(Array.from({ length: 12 }, (_, i) => i));

      // Auto-hide after animation
      const timer = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[70]">
      {/* Success checkmark */}
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-purple-500/30 rounded-full blur-3xl animate-pulse-glow" style={{ width: '200px', height: '200px', margin: '-50px' }} />

        {/* Checkmark circle */}
        <div className="relative bg-gradient-to-br from-purple-600 to-blue-600 rounded-full p-8 animate-scale-in" style={{ animation: 'scale-in 0.5s ease-out forwards, lock-unlock 0.8s ease-in-out 0.3s' }}>
          <svg className="w-24 h-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
              strokeDasharray="100"
              style={{
                animation: 'success-checkmark 0.6s ease-out 0.4s forwards',
                strokeDashoffset: '100',
              }}
            />
          </svg>
        </div>

        {/* Particles */}
        {particles.map((i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 w-2 h-2 bg-purple-400 rounded-full"
            style={{
              animation: `particle-rise 1.5s ease-out ${i * 0.1}s forwards`,
              transform: `rotate(${i * 30}deg) translateX(80px)`,
            }}
          />
        ))}
      </div>

      {/* Success text */}
      <div className="absolute bottom-1/3 text-center animate-fade-in" style={{ animationDelay: '0.5s', opacity: 0 }}>
        <p className="text-white text-2xl font-bold mb-1">Saved to Blockchain!</p>
        <p className="text-purple-300 text-sm">Your vault is encrypted and secure</p>
      </div>
    </div>
  );
}
