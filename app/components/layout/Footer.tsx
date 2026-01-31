import { Container } from './Container';
import { APP_VERSION } from '../../lib/constants';

export function Footer() {
  return (
    <footer className="border-t border-white/5 glass mt-20">
      <Container>
        <div className="py-12">
          <div className="flex flex-col items-center gap-6">
            {/* Tech Stack */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z" />
                </svg>
                <span>Solana Blockchain</span>
              </div>
              <span className="text-gray-700">•</span>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M13 10V3L4 14h7v7l9-11h-7z" clipRule="evenodd" />
                </svg>
                <span>Light Protocol</span>
              </div>
              <span className="text-gray-700">•</span>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                </svg>
                <span>ZK Compression</span>
              </div>
            </div>

            {/* Main Info */}
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2 font-medium">
                Open Source • Non-Custodial • Zero-Knowledge
              </p>
              <p className="text-xs text-gray-600">
                Client-side encryption • Decentralized storage • Full privacy
              </p>
            </div>

            {/* Version */}
            <div className="text-xs text-gray-700">
              v{APP_VERSION}
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
