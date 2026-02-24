FROM node:22-alpine AS base
RUN apk add --no-cache python3 make g++ && \
    corepack enable && corepack prepare pnpm@10.28.2 --activate
WORKDIR /app

# Copy everything and install in one stage to preserve pnpm symlinks
COPY . .
RUN pnpm install --frozen-lockfile
RUN npm install -g tsx

ENV NODE_ENV=production
EXPOSE 3001
ENV PORT=3001
# Wrap in shell to capture crash output
CMD ["sh", "-c", "echo '=== ENV CHECK ===' && echo \"DATABASE_URL set: $(test -n \"$DATABASE_URL\" && echo YES || echo NO)\" && echo \"NODE_ENV: $NODE_ENV\" && echo \"PORT: $PORT\" && echo '=== STARTING ===' && exec tsx apps/api/src/index.ts"]
