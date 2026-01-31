import { NextRequest, NextResponse } from 'next/server';
import { eq, and, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { menus, menuCategories, chefProfiles, users } from '@/lib/schema';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
    const category = searchParams.get('category');
    const offset = (page - 1) * limit;

    // Build query
    let query = db
      .select({
        id: menus.id,
        name: menus.name,
        description: menus.description,
        price: menus.price,
        images: menus.images,
        isVegetarian: menus.isVegetarian,
        isVegan: menus.isVegan,
        averageRating: menus.averageRating,
        totalOrders: menus.totalOrders,
        categoryName: menuCategories.name,
        categorySlug: menuCategories.slug,
        chefId: chefProfiles.id,
        chefFirstName: users.firstName,
        chefLastName: users.lastName,
        chefAvatarUrl: users.avatarUrl,
        chefRating: chefProfiles.averageRating,
        chefIsVerified: chefProfiles.isVerified,
      })
      .from(menus)
      .innerJoin(menuCategories, eq(menus.categoryId, menuCategories.id))
      .innerJoin(chefProfiles, eq(menus.chefId, chefProfiles.id))
      .innerJoin(users, eq(chefProfiles.userId, users.id))
      .where(eq(menus.isAvailable, true))
      .limit(limit)
      .offset(offset);

    const menusData = await query;

    // Get total count
    const countResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(menus)
      .where(eq(menus.isAvailable, true));

    const total = countResult[0]?.count ?? 0;

    return NextResponse.json({
      success: true,
      data: menusData.map((menu) => ({
        id: menu.id,
        name: menu.name,
        description: menu.description,
        price: menu.price,
        images: menu.images,
        isVegetarian: menu.isVegetarian,
        isVegan: menu.isVegan,
        averageRating: menu.averageRating,
        totalOrders: menu.totalOrders,
        category: {
          name: menu.categoryName,
          slug: menu.categorySlug,
        },
        chef: {
          id: menu.chefId,
          firstName: menu.chefFirstName,
          lastName: menu.chefLastName,
          avatarUrl: menu.chefAvatarUrl,
          averageRating: menu.chefRating,
          isVerified: menu.chefIsVerified,
        },
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: offset + menusData.length < total,
      },
    });
  } catch (error) {
    console.error('Fetch menus error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
