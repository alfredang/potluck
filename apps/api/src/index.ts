import Fastify, { type FastifyError } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { config } from './config/index.js';
import { db } from './db/index.js';

// Import routes
import { authRoutes } from './routes/auth/index.js';
import { chefsRoutes } from './routes/chefs/index.js';
import { menusRoutes } from './routes/menus/index.js';
import { bookingsRoutes } from './routes/bookings/index.js';
import { paymentsRoutes } from './routes/payments/index.js';
import { subscriptionsRoutes } from './routes/subscriptions/index.js';
import { reviewsRoutes } from './routes/reviews/index.js';
import { adminRoutes } from './routes/admin/index.js';
import { webhooksRoutes } from './webhooks/index.js';

const fastify = Fastify({
  logger: config.isDevelopment
    ? {
        level: 'debug',
        transport: {
          target: 'pino-pretty',
          options: {
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
          },
        },
      }
    : {
        level: 'info',
      },
});

// Decorate with database
fastify.decorate('db', db);

// Register plugins
async function registerPlugins() {
  await fastify.register(cors, {
    origin: config.isDevelopment
      ? true
      : [config.appUrl, /\.homechef\.com$/],
    credentials: true,
  });

  await fastify.register(helmet, {
    contentSecurityPolicy: false, // Let the frontend handle CSP
  });

  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
    skipOnError: true,
    keyGenerator: (request) => {
      return request.headers['x-forwarded-for']?.toString() ?? request.ip;
    },
  });
}

// Register routes
async function registerRoutes() {
  // Health check
  fastify.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  // API v1 routes
  await fastify.register(
    async (app) => {
      await app.register(authRoutes, { prefix: '/auth' });
      await app.register(chefsRoutes, { prefix: '/chefs' });
      await app.register(menusRoutes, { prefix: '/menus' });
      await app.register(bookingsRoutes, { prefix: '/bookings' });
      await app.register(paymentsRoutes, { prefix: '/payments' });
      await app.register(subscriptionsRoutes, { prefix: '/subscriptions' });
      await app.register(reviewsRoutes, { prefix: '/reviews' });
      await app.register(adminRoutes, { prefix: '/admin' });
    },
    { prefix: '/api/v1' }
  );

  // Webhooks (outside of API versioning)
  await fastify.register(webhooksRoutes, { prefix: '/webhooks' });
}

// Error handler
fastify.setErrorHandler((error: FastifyError, _request, reply) => {
  fastify.log.error(error);

  const statusCode = error.statusCode ?? 500;
  const message =
    statusCode === 500 && config.isProduction ? 'Internal Server Error' : error.message;

  reply.status(statusCode).send({
    success: false,
    error: {
      code: error.code ?? 'INTERNAL_ERROR',
      message,
      ...(config.isDevelopment && { stack: error.stack }),
    },
  });
});

// Start server
async function start() {
  try {
    await registerPlugins();
    await registerRoutes();

    await fastify.listen({
      port: config.port,
      host: config.host,
    });

    console.log(`HomeChef API running at http://${config.host}:${config.port}`);
  } catch (err: unknown) {
    fastify.log.error({ err }, 'Failed to start server');
    process.exit(1);
  }
}

start();

// Graceful shutdown
const signals = ['SIGINT', 'SIGTERM'] as const;
for (const signal of signals) {
  process.on(signal, async () => {
    fastify.log.info(`Received ${signal}, shutting down gracefully...`);
    await fastify.close();
    process.exit(0);
  });
}
