/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // For Docker deployment
  typescript: {
    ignoreBuildErrors: true,
  },
  // Security Headers - XSS, Clickjacking, MIME-sniffing protection
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' blob:", // Required for Next.js + WASM
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://api.helius.xyz https://api.devnet.solana.com https://api.mainnet-beta.solana.com https://*.pinata.cloud wss://*.solana.com https://*.helius-rpc.com",
              "worker-src 'self' blob:", // For Web Workers
              "child-src 'self' blob:", // For iframes and workers
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "object-src 'none'"
            ].join('; ')
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY' // Prevent clickjacking
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff' // Prevent MIME-sniffing
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block' // Enable XSS filtering
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin' // Limit referrer info
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=()' // Disable unnecessary APIs
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload' // Force HTTPS
          }
        ]
      }
    ];
  },
  webpack: (config, { isServer }) => {
    // WASM support for Noir.js
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };

    // Handle .wasm files
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'webassembly/async',
    });

    // Fallback for Node.js modules in browser
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        path: false,
        os: false,
        'node:stream': false,
        'node:crypto': false,
        'node:buffer': false,
        'node:util': false,
        'node:url': false,
        'node:events': false,
        'pino-pretty': false, // WalletConnect dependency
      };
    }

    // Ignore node: protocol imports
    config.resolve.alias = {
      ...config.resolve.alias,
      'node:stream': false,
      'node:crypto': false,
      'node:buffer': false,
      'node:util': false,
      'node:url': false,
      'node:events': false,
    };

    return config;
  },
}

module.exports = nextConfig
