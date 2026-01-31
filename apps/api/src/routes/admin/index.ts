import type { FastifyPluginAsync } from 'fastify';
import { sql } from 'drizzle-orm';
import { db, schema } from '../../db/index.js';

export const adminRoutes: FastifyPluginAsync = async (fastify) => {
  // TODO: Add admin authentication middleware

  // Dashboard stats
  fastify.get('/dashboard', async (_, reply) => {
    const [usersCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.users);

    const [chefsCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.chefProfiles);

    const [bookingsCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.bookings);

    const [revenue] = await db
      .select({ total: sql<number>`COALESCE(SUM(platform_fee), 0)::int` })
      .from(schema.payments);

    return reply.send({
      success: true,
      data: {
        totalUsers: usersCount?.count ?? 0,
        totalChefs: chefsCount?.count ?? 0,
        totalBookings: bookingsCount?.count ?? 0,
        totalRevenue: revenue?.total ?? 0,
      },
    });
  });

  // List users
  fastify.get('/users', async (_, reply) => {
    const users = await db.query.users.findMany({
      columns: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      limit: 50,
      orderBy: (u, { desc }) => [desc(u.createdAt)],
    });

    return reply.send({
      success: true,
      data: users,
    });
  });

  // List chefs
  fastify.get('/chefs', async (_, reply) => {
    const chefs = await db.query.chefProfiles.findMany({
      with: {
        user: {
          columns: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        subscription: true,
      },
      limit: 50,
      orderBy: (c, { desc }) => [desc(c.createdAt)],
    });

    return reply.send({
      success: true,
      data: chefs,
    });
  });

  // List bookings
  fastify.get('/bookings', async (_, reply) => {
    const bookings = await db.query.bookings.findMany({
      with: {
        customer: {
          columns: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        chef: {
          with: {
            user: {
              columns: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        menu: {
          columns: {
            id: true,
            name: true,
          },
        },
        payment: true,
      },
      limit: 50,
      orderBy: (b, { desc }) => [desc(b.createdAt)],
    });

    return reply.send({
      success: true,
      data: bookings,
    });
  });

  // List disputes
  fastify.get('/disputes', async (_, reply) => {
    const disputes = await db.query.disputes.findMany({
      with: {
        booking: true,
        raisedBy: {
          columns: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      limit: 50,
      orderBy: (d, { desc }) => [desc(d.createdAt)],
    });

    return reply.send({
      success: true,
      data: disputes,
    });
  });

  // Top chefs ranking
  fastify.get('/rankings/chefs', async (_, reply) => {
    const chefs = await db.query.chefProfiles.findMany({
      with: {
        user: {
          columns: {
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: (c, { desc }) => [desc(c.totalReviews), desc(c.averageRating)],
      limit: 10,
    });

    return reply.send({
      success: true,
      data: chefs,
    });
  });

  // Top menus ranking
  fastify.get('/rankings/menus', async (_, reply) => {
    const menus = await db.query.menus.findMany({
      with: {
        chef: {
          with: {
            user: {
              columns: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: (m, { desc }) => [desc(m.totalOrders), desc(m.averageRating)],
      limit: 10,
    });

    return reply.send({
      success: true,
      data: menus,
    });
  });
};
