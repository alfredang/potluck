FROM node:22-alpine AS base
RUN apk add --no-cache python3 make g++ && \
    corepack enable && corepack prepare pnpm@10.28.2 --activate
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json .npmrc ./
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/
RUN pnpm install --frozen-lockfile

# Production image — run with tsx directly (skip tsc build)
FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app

# Copy source FIRST, then overlay node_modules so deps aren't overwritten
COPY . .
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules

RUN npm install -g tsx
RUN npm rebuild argon2 2>/dev/null || echo "argon2 rebuild skipped"
EXPOSE 3001
ENV PORT=3001
CMD ["tsx", "apps/api/src/index.ts"]
