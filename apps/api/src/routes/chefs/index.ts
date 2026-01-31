import type { FastifyPluginAsync } from 'fastify';
import { eq, and, gte, sql } from 'drizzle-orm';
import { db, schema } from '../../db/index.js';
import { chefQuerySchema } from '@homechef/shared';

export const chefsRoutes: FastifyPluginAsync = async (fastify) => {
  // List chefs with filters
  fastify.get('/', async (request, reply) => {
    const validation = chefQuerySchema.safeParse(request.query);
    if (!validation.success) {
      return reply.status(400).send({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid query parameters',
          details: validation.error.flatten().fieldErrors,
        },
      });
    }

    const { page, limit, rating, isVerified } = validation.data;
    const offset = (page - 1) * limit;

    // Build where conditions
    const conditions = [
      eq(schema.chefProfiles.isAvailable, true),
    ];

    if (rating) {
      conditions.push(gte(schema.chefProfiles.averageRating, rating.toString()));
    }

    if (isVerified !== undefined) {
      conditions.push(eq(schema.chefProfiles.isVerified, isVerified));
    }

    const chefs = await db.query.chefProfiles.findMany({
      where: and(...conditions),
      with: {
        user: {
          columns: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        menus: {
          where: eq(schema.menus.isAvailable, true),
          limit: 3,
          columns: {
            id: true,
            name: true,
            price: true,
            images: true,
          },
        },
      },
      limit,
      offset,
      orderBy: (chefs, { desc }) => [desc(chefs.averageRating)],
    });

    const total = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.chefProfiles)
      .where(and(...conditions));

    return reply.send({
      success: true,
      data: chefs,
      pagination: {
        page,
        limit,
        total: total[0]?.count ?? 0,
        totalPages: Math.ceil((total[0]?.count ?? 0) / limit),
        hasMore: offset + chefs.length < (total[0]?.count ?? 0),
      },
    });
  });

  // Get featured chefs
  fastify.get('/featured', async (_, reply) => {
    const chefs = await db.query.chefProfiles.findMany({
      where: and(
        eq(schema.chefProfiles.isAvailable, true),
        eq(schema.chefProfiles.isVerified, true)
      ),
      with: {
        user: {
          columns: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
      limit: 10,
      orderBy: (chefs, { desc }) => [desc(chefs.averageRating), desc(chefs.totalReviews)],
    });

    return reply.send({
      success: true,
      data: chefs,
    });
  });

  // Get chef by ID
  fastify.get<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const { id } = request.params;

    const chef = await db.query.chefProfiles.findFirst({
      where: eq(schema.chefProfiles.id, id),
      with: {
        user: {
          columns: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        menus: {
          where: eq(schema.menus.isAvailable, true),
          with: {
            category: true,
          },
        },
      },
    });

    if (!chef) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Chef not found' },
      });
    }

    return reply.send({
      success: true,
      data: chef,
    });
  });

  // Get chef's availability
  fastify.get<{ Params: { id: string } }>('/:id/availability', async (request, reply) => {
    const { id } = request.params;
    const today = new Date().toISOString().split('T')[0];

    const availability = await db.query.chefAvailability.findMany({
      where: and(
        eq(schema.chefAvailability.chefId, id),
        eq(schema.chefAvailability.isAvailable, true),
        gte(schema.chefAvailability.date, today!)
      ),
      orderBy: (a, { asc }) => [asc(a.date), asc(a.startTime)],
    });

    return reply.send({
      success: true,
      data: availability,
    });
  });

  // Get chef's reviews
  fastify.get<{ Params: { id: string } }>('/:id/reviews', async (request, reply) => {
    const { id } = request.params;

    const reviews = await db.query.reviews.findMany({
      where: and(
        eq(schema.reviews.chefId, id),
        eq(schema.reviews.isVisible, true)
      ),
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
      limit: 20,
    });

    return reply.send({
      success: true,
      data: reviews,
    });
  });
};
