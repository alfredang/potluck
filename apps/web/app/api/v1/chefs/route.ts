import { NextRequest, NextResponse } from 'next/server';
import { eq, and, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { chefProfiles, users, menus } from '@/lib/schema';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
    const offset = (page - 1) * limit;

    // Fetch chefs with their user info
    const chefsData = await db
      .select({
        id: chefProfiles.id,
        bio: chefProfiles.bio,
        specialties: chefProfiles.specialties,
        city: chefProfiles.city,
        averageRating: chefProfiles.averageRating,
        totalReviews: chefProfiles.totalReviews,
        isVerified: chefProfiles.isVerified,
        firstName: users.firstName,
        lastName: users.lastName,
        avatarUrl: users.avatarUrl,
      })
      .from(chefProfiles)
      .innerJoin(users, eq(chefProfiles.userId, users.id))
      .where(eq(chefProfiles.isAvailable, true))
      .limit(limit)
      .offset(offset);

    // Get total count
    const countResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(chefProfiles)
      .where(eq(chefProfiles.isAvailable, true));

    const total = countResult[0]?.count ?? 0;

    return NextResponse.json({
      success: true,
      data: chefsData.map((chef) => ({
        id: chef.id,
        bio: chef.bio,
        specialties: chef.specialties,
        city: chef.city,
        averageRating: chef.averageRating,
        totalReviews: chef.totalReviews,
        isVerified: chef.isVerified,
        user: {
          firstName: chef.firstName,
          lastName: chef.lastName,
          avatarUrl: chef.avatarUrl,
        },
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: offset + chefsData.length < total,
      },
    });
  } catch (error) {
    console.error('Fetch chefs error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
