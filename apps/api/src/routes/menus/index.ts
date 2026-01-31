import type { FastifyPluginAsync } from 'fastify';
import { eq, and, sql } from 'drizzle-orm';
import { db, schema } from '../../db/index.js';
import { menuQuerySchema } from '@homechef/shared';

export const menusRoutes: FastifyPluginAsync = async (fastify) => {
  // List menus with filters
  fastify.get('/', async (request, reply) => {
    const validation = menuQuerySchema.safeParse(request.query);
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

    const { page, limit, isVegetarian, isVegan, isGlutenFree, sortBy, sortOrder } = validation.data;
    const offset = (page - 1) * limit;

    const conditions = [eq(schema.menus.isAvailable, true)];

    if (isVegetarian) {
      conditions.push(eq(schema.menus.isVegetarian, true));
    }
    if (isVegan) {
      conditions.push(eq(schema.menus.isVegan, true));
    }
    if (isGlutenFree) {
      conditions.push(eq(schema.menus.isGlutenFree, true));
    }

    const menus = await db.query.menus.findMany({
      where: and(...conditions),
      with: {
        category: true,
        chef: {
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
        },
      },
      limit,
      offset,
      orderBy: (menus, { desc, asc }) => {
        const direction = sortOrder === 'asc' ? asc : desc;
        switch (sortBy) {
          case 'price':
            return [direction(menus.price)];
          case 'rating':
            return [direction(menus.averageRating)];
          case 'orders':
            return [direction(menus.totalOrders)];
          default:
            return [desc(menus.createdAt)];
        }
      },
    });

    const total = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.menus)
      .where(and(...conditions));

    return reply.send({
      success: true,
      data: menus,
      pagination: {
        page,
        limit,
        total: total[0]?.count ?? 0,
        totalPages: Math.ceil((total[0]?.count ?? 0) / limit),
        hasMore: offset + menus.length < (total[0]?.count ?? 0),
      },
    });
  });

  // Get featured menus
  fastify.get('/featured', async (_, reply) => {
    const menus = await db.query.menus.findMany({
      where: and(eq(schema.menus.isAvailable, true), eq(schema.menus.isFeatured, true)),
      with: {
        category: true,
        chef: {
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
        },
      },
      limit: 10,
      orderBy: (menus, { desc }) => [desc(menus.averageRating)],
    });

    return reply.send({
      success: true,
      data: menus,
    });
  });

  // Get all categories
  fastify.get('/categories', async (_, reply) => {
    const categories = await db.query.menuCategories.findMany({
      where: eq(schema.menuCategories.isActive, true),
      orderBy: (c, { asc }) => [asc(c.displayOrder)],
    });

    return reply.send({
      success: true,
      data: categories,
    });
  });

  // Get menu by ID
  fastify.get<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const { id } = request.params;

    const menu = await db.query.menus.findFirst({
      where: eq(schema.menus.id, id),
      with: {
        category: true,
        chef: {
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
        },
      },
    });

    if (!menu) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Menu not found' },
      });
    }

    return reply.send({
      success: true,
      data: menu,
    });
  });
};
