# ============================================
# HideMyPass - Production Dockerfile
# Optimized for Coolify deployment
# ============================================

# Stage 1: Dependencies
FROM node:22-alpine AS deps

# Install libc6-compat for Alpine compatibility
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies with clean install (legacy-peer-deps for Light Protocol compatibility)
RUN npm ci --legacy-peer-deps --ignore-scripts

# ============================================
# Stage 2: Builder
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy all source files
COPY . .

# Build arguments for environment variables
ARG NEXT_PUBLIC_SOLANA_NETWORK
ARG NEXT_PUBLIC_HELIUS_API_KEY
ARG NEXT_PUBLIC_PINATA_JWT
ARG NEXT_PUBLIC_PINATA_GATEWAY
ARG NEXT_PUBLIC_IPFS_GATEWAY_1
ARG NEXT_PUBLIC_IPFS_GATEWAY_2

# Set environment variables for build
ENV NEXT_PUBLIC_SOLANA_NETWORK=$NEXT_PUBLIC_SOLANA_NETWORK
ENV NEXT_PUBLIC_HELIUS_API_KEY=$NEXT_PUBLIC_HELIUS_API_KEY
ENV NEXT_PUBLIC_PINATA_JWT=$NEXT_PUBLIC_PINATA_JWT
ENV NEXT_PUBLIC_PINATA_GATEWAY=$NEXT_PUBLIC_PINATA_GATEWAY
ENV NEXT_PUBLIC_IPFS_GATEWAY_1=$NEXT_PUBLIC_IPFS_GATEWAY_1
ENV NEXT_PUBLIC_IPFS_GATEWAY_2=$NEXT_PUBLIC_IPFS_GATEWAY_2

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Build Next.js application
RUN npm run build

# ============================================
# Stage 3: Runner (Production)
FROM node:22-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Copy standalone build (Next.js output: 'standalone')
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose port 3000
EXPOSE 3000

# Set port environment variable
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "server.js"]
