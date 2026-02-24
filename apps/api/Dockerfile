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
CMD ["tsx", "apps/api/src/index.ts"]
