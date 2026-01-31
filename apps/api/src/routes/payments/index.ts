import type { FastifyPluginAsync } from 'fastify';

export const paymentsRoutes: FastifyPluginAsync = async (fastify) => {
  // Create payment intent
  fastify.post('/create-intent', async (_, reply) => {
    // TODO: Implement with Stripe
    return reply.status(501).send({
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Not implemented yet' },
    });
  });

  // Confirm payment
  fastify.post('/confirm', async (_, reply) => {
    // TODO: Implement
    return reply.status(501).send({
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Not implemented yet' },
    });
  });

  // Get payment by booking ID
  fastify.get<{ Params: { bookingId: string } }>('/:bookingId', async (_, reply) => {
    // TODO: Implement
    return reply.status(501).send({
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Not implemented yet' },
    });
  });
};
