FROM node:22-alpine AS base
RUN apk add --no-cache python3 make g++ && \
    corepack enable && corepack prepare pnpm@10.28.2 --activate
WORKDIR /app

# Install dependencies with native builds enabled
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json .npmrc ./
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/
RUN pnpm install --frozen-lockfile

# Production image
FROM node:22-alpine AS runner
RUN apk add --no-cache python3 make g++
ENV NODE_ENV=production
WORKDIR /app
RUN addgroup --system --gid 1001 appgroup && adduser --system --uid 1001 appuser
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules
COPY . .

# Install tsx globally for running TypeScript
RUN npm install -g tsx

# Rebuild native modules in the runner
RUN cd /app && npx pnpm approve-builds argon2 esbuild 2>/dev/null || true
RUN cd /app && npm rebuild argon2 2>/dev/null || true

USER appuser
EXPOSE 3001
ENV PORT=3001
CMD ["tsx", "apps/api/src/index.ts"]
