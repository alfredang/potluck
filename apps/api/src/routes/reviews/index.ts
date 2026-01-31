import type { FastifyPluginAsync } from 'fastify';
import { eq, and } from 'drizzle-orm';
import { db, schema } from '../../db/index.js';

export const reviewsRoutes: FastifyPluginAsync = async (fastify) => {
  // Get reviews for a menu
  fastify.get<{ Params: { menuId: string } }>('/menu/:menuId', async (request, reply) => {
    const { menuId } = request.params;

    const reviews = await db.query.reviews.findMany({
      where: and(eq(schema.reviews.menuId, menuId), eq(schema.reviews.isVisible, true)),
      with: {
        customer: {
          columns: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: (r, { desc }) => [desc(r.createdAt)],
    });

    return reply.send({
      success: true,
      data: reviews,
    });
  });

  // Get reviews for a chef
  fastify.get<{ Params: { chefId: string } }>('/chef/:chefId', async (request, reply) => {
    const { chefId } = request.params;

    const reviews = await db.query.reviews.findMany({
      where: and(eq(schema.reviews.chefId, chefId), eq(schema.reviews.isVisible, true)),
      with: {
        customer: {
          columns: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        menu: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: (r, { desc }) => [desc(r.createdAt)],
    });

    return reply.send({
      success: true,
      data: reviews,
    });
  });

  // Create review
  fastify.post('/', async (_, reply) => {
    // TODO: Implement with authentication
    return reply.status(501).send({
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Not implemented yet' },
    });
  });

  // Chef respond to review
  fastify.post<{ Params: { id: string } }>('/:id/respond', async (_, reply) => {
    // TODO: Implement
    return reply.status(501).send({
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Not implemented yet' },
    });
  });
};
