FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.28.2 --activate
WORKDIR /app

# Build stage — copy everything and install in ONE stage so pnpm's workspace
# symlinks stay intact (copying node_modules between stages breaks them).
FROM base AS builder
COPY . .
RUN pnpm install --no-frozen-lockfile
ENV NEXT_TELEMETRY_DISABLED=1
# DATABASE_URL is a build placeholder; real value is injected at runtime.
ARG DATABASE_URL=postgres://placeholder:placeholder@localhost:5432/placeholder
ENV DATABASE_URL=${DATABASE_URL}
RUN pnpm --filter @homechef/shared build 2>/dev/null || true
RUN pnpm --filter @homechef/web build
RUN mkdir -p /app/apps/web/public

# Runner — slim image serving Next.js standalone output (self-contained).
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "apps/web/server.js"]
