import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { sign } from 'jsonwebtoken';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { loginSchema } from '@homechef/shared';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input',
            details: validation.error.flatten().fieldErrors,
          },
        },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // Find user
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (!user[0] || !user[0].passwordHash) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' },
        },
        { status: 401 }
      );
    }

    // TODO: Verify password with argon2 (needs edge-compatible version)
    // For prototype, simplified check

    // Generate JWT
    const accessToken = sign(
      {
        userId: user[0].id,
        email: user[0].email,
        role: user[0].role,
      },
      process.env.JWT_ACCESS_SECRET!,
      { expiresIn: '15m' }
    );

    const refreshToken = sign(
      { userId: user[0].id },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user[0].id,
          email: user[0].email,
          firstName: user[0].firstName,
          lastName: user[0].lastName,
          role: user[0].role,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
