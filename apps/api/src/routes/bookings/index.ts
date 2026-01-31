import type { FastifyPluginAsync } from 'fastify';

export const bookingsRoutes: FastifyPluginAsync = async (fastify) => {
  // List user's bookings
  fastify.get('/', async (_, reply) => {
    // TODO: Implement with authentication
    return reply.send({ success: true, data: [] });
  });

  // Get booking by ID
  fastify.get<{ Params: { id: string } }>('/:id', async (_request, reply) => {
    // TODO: Implement
    return reply.status(501).send({
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Not implemented yet' },
    });
  });

  // Create booking
  fastify.post('/', async (_, reply) => {
    // TODO: Implement
    return reply.status(501).send({
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Not implemented yet' },
    });
  });

  // Confirm booking (chef)
  fastify.put<{ Params: { id: string } }>('/:id/confirm', async (_, reply) => {
    // TODO: Implement
    return reply.status(501).send({
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Not implemented yet' },
    });
  });

  // Complete booking (customer)
  fastify.put<{ Params: { id: string } }>('/:id/complete', async (_, reply) => {
    // TODO: Implement
    return reply.status(501).send({
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Not implemented yet' },
    });
  });

  // Cancel booking
  fastify.post<{ Params: { id: string } }>('/:id/cancel', async (_, reply) => {
    // TODO: Implement
    return reply.status(501).send({
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Not implemented yet' },
    });
  });
};
