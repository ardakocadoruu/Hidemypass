'use client';

export function VaultUnlock() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        {/* Animated lock icon */}
        <div className="relative inline-block mb-8">
          {/* Glow rings */}
          <div className="absolute inset-0 -m-8">
            <div className="w-32 h-32 border-2 border-purple-500/30 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
          </div>
          <div className="absolute inset-0 -m-6">
            <div className="w-28 h-28 border-2 border-blue-500/30 rounded-full animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.3s' }} />
          </div>

          {/* Lock icon with glow */}
          <div className="relative bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-6 animate-pulse-glow" style={{ animation: 'pulse-glow 2s ease-in-out infinite, lock-unlock 1s ease-in-out infinite' }}>
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>

        {/* Loading text */}
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-white animate-fade-in">
            Unlocking Your Vault
          </h3>
          <p className="text-gray-400 animate-fade-in" style={{ animationDelay: '0.2s', opacity: 0 }}>
            Deriving encryption key from your wallet...
          </p>
        </div>

        {/* Loading dots */}
        <div className="flex items-center justify-center gap-2 mt-6 animate-fade-in" style={{ animationDelay: '0.4s', opacity: 0 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
              style={{
                animationDelay: `${i * 0.15}s`,
                animationDuration: '0.6s',
              }}
            />
          ))}
        </div>

        {/* Security info */}
        <div className="mt-8 glass rounded-xl p-4 max-w-md mx-auto animate-fade-in" style={{ animationDelay: '0.6s', opacity: 0 }}>
          <div className="flex items-start gap-3 text-left">
            <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-300 font-medium mb-1">End-to-End Encryption</p>
              <p className="text-xs text-gray-500">
                Your encryption key never leaves your browser and is derived from your wallet signature.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
