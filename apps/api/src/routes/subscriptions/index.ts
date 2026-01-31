import type { FastifyPluginAsync } from 'fastify';
import { SUBSCRIPTION_PLANS } from '@homechef/shared';

export const subscriptionsRoutes: FastifyPluginAsync = async (fastify) => {
  // Get subscription plans
  fastify.get('/plans', async (_, reply) => {
    return reply.send({
      success: true,
      data: Object.values(SUBSCRIPTION_PLANS),
    });
  });

  // Get current subscription (chef)
  fastify.get('/current', async (_, reply) => {
    // TODO: Implement with authentication
    return reply.status(501).send({
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Not implemented yet' },
    });
  });

  // Subscribe to plan
  fastify.post('/subscribe', async (_, reply) => {
    // TODO: Implement with Stripe
    return reply.status(501).send({
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Not implemented yet' },
    });
  });

  // Change subscription
  fastify.put('/change', async (_, reply) => {
    // TODO: Implement
    return reply.status(501).send({
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Not implemented yet' },
    });
  });

  // Cancel subscription
  fastify.post('/cancel', async (_, reply) => {
    // TODO: Implement
    return reply.status(501).send({
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Not implemented yet' },
    });
  });
};
