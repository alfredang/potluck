FROM node:22-alpine AS base
RUN apk add --no-cache python3 make g++ && \
    corepack enable && corepack prepare pnpm@10.28.2 --activate
WORKDIR /app

# Install dependencies (with native build support)
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json .npmrc ./
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/
RUN pnpm install --frozen-lockfile

# Build TypeScript
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules
COPY . .
# Build shared package first, then the API
RUN pnpm --filter @homechef/shared build 2>/dev/null || true
RUN pnpm --filter @homechef/api build 2>/dev/null || \
    echo "[build] TypeScript compile failed or no build script — will fall back to tsx"

# Production runner
FROM node:22-alpine AS runner
# Keep build tools available for native module compilation (argon2)
RUN apk add --no-cache python3 make g++
ENV NODE_ENV=production
WORKDIR /app

RUN addgroup --system --gid 1001 appgroup && \
    adduser --system --uid 1001 appuser

# Copy node_modules (with pre-built native binaries from deps stage)
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules

# Copy source and built output
COPY . .
COPY --from=builder /app/apps/api/dist ./apps/api/dist 2>/dev/null || true
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist 2>/dev/null || true

# Rebuild argon2 for the current Alpine environment (must be done as root)
RUN npm rebuild argon2 2>/dev/null || \
    (cd apps/api && npm rebuild argon2 2>/dev/null) || \
    echo "[warn] argon2 rebuild failed — password hashing may not work"

# Install tsx globally as a fallback runner
RUN npm install -g tsx

USER appuser
EXPOSE 3001
ENV PORT=3001
ENV HOST=0.0.0.0

# Use compiled JS if dist exists, otherwise fall back to tsx + TypeScript source
CMD ["sh", "-c", \
  "if [ -f apps/api/dist/index.js ]; then node apps/api/dist/index.js; else tsx apps/api/src/index.ts; fi"]
