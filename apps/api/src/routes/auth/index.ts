import type { FastifyPluginAsync } from 'fastify';
import { eq } from 'drizzle-orm';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import { db, schema } from '../../db/index.js';
import { config } from '../../config/index.js';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  type RegisterInput,
  type LoginInput,
} from '@homechef/shared';

interface JwtPayload {
  userId: string;
  email: string;
  role: 'customer' | 'chef' | 'admin';
}

function generateTokens(user: { id: string; email: string; role: string }) {
  const accessToken = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    } as JwtPayload,
    config.jwtAccessSecret,
    { expiresIn: config.jwtAccessExpiry }
  );

  const refreshToken = jwt.sign(
    {
      userId: user.id,
      tokenId: nanoid(),
    },
    config.jwtRefreshSecret,
    { expiresIn: config.jwtRefreshExpiry }
  );

  return { accessToken, refreshToken };
}

export const authRoutes: FastifyPluginAsync = async (fastify) => {
  // Register
  fastify.post<{ Body: RegisterInput }>('/register', async (request, reply) => {
    const validation = registerSchema.safeParse(request.body);
    if (!validation.success) {
      return reply.status(400).send({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input',
          details: validation.error.flatten().fieldErrors,
        },
      });
    }

    const { email, password, firstName, lastName, role, phone } = validation.data;

    // Check if user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(schema.users.email, email.toLowerCase()),
    });

    if (existingUser) {
      return reply.status(409).send({
        success: false,
        error: {
          code: 'USER_EXISTS',
          message: 'A user with this email already exists',
        },
      });
    }

    // Hash password
    const passwordHash = await argon2.hash(password);

    // Create user
    const [user] = await db
      .insert(schema.users)
      .values({
        email: email.toLowerCase(),
        passwordHash,
        firstName,
        lastName,
        role: role ?? 'customer',
        phone: phone ?? null,
        emailVerificationToken: nanoid(32),
      })
      .returning();

    if (!user) {
      return reply.status(500).send({
        success: false,
        error: { code: 'CREATE_FAILED', message: 'Failed to create user' },
      });
    }

    // If registering as chef, create chef profile and free subscription
    if (role === 'chef') {
      const [chefProfile] = await db
        .insert(schema.chefProfiles)
        .values({
          userId: user.id,
        })
        .returning();

      if (chefProfile) {
        await db.insert(schema.subscriptions).values({
          chefId: chefProfile.id,
          tier: 'free',
          maxMenus: 1,
        });
      }
    }

    const tokens = generateTokens(user);

    return reply.status(201).send({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        ...tokens,
      },
    });
  });

  // Login
  fastify.post<{ Body: LoginInput }>('/login', async (request, reply) => {
    const validation = loginSchema.safeParse(request.body);
    if (!validation.success) {
      return reply.status(400).send({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input',
          details: validation.error.flatten().fieldErrors,
        },
      });
    }

    const { email, password } = validation.data;

    // Find user
    const user = await db.query.users.findFirst({
      where: eq(schema.users.email, email.toLowerCase()),
    });

    if (!user || !user.passwordHash) {
      return reply.status(401).send({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        },
      });
    }

    // Verify password
    const validPassword = await argon2.verify(user.passwordHash, password);
    if (!validPassword) {
      return reply.status(401).send({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        },
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return reply.status(403).send({
        success: false,
        error: {
          code: 'ACCOUNT_DISABLED',
          message: 'Your account has been disabled',
        },
      });
    }

    // Update last login
    await db
      .update(schema.users)
      .set({ lastLoginAt: new Date() })
      .where(eq(schema.users.id, user.id));

    const tokens = generateTokens(user);

    return reply.send({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          avatarUrl: user.avatarUrl,
        },
        ...tokens,
      },
    });
  });

  // Refresh token
  fastify.post<{ Body: { refreshToken: string } }>('/refresh', async (request, reply) => {
    const validation = refreshTokenSchema.safeParse(request.body);
    if (!validation.success) {
      return reply.status(400).send({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid refresh token',
        },
      });
    }

    const { refreshToken } = validation.data;

    try {
      const payload = jwt.verify(refreshToken, config.jwtRefreshSecret) as {
        userId: string;
        tokenId: string;
      };

      const user = await db.query.users.findFirst({
        where: eq(schema.users.id, payload.userId),
      });

      if (!user || !user.isActive) {
        return reply.status(401).send({
          success: false,
          error: {
            code: 'INVALID_TOKEN',
            message: 'Invalid or expired refresh token',
          },
        });
      }

      const accessToken = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role,
        } as JwtPayload,
        config.jwtAccessSecret,
        { expiresIn: config.jwtAccessExpiry }
      );

      return reply.send({
        success: true,
        data: { accessToken },
      });
    } catch {
      return reply.status(401).send({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid or expired refresh token',
        },
      });
    }
  });

  // Get current user
  fastify.get('/me', async (request, reply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return reply.status(401).send({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Missing authorization header' },
      });
    }

    const token = authHeader.substring(7);

    try {
      const payload = jwt.verify(token, config.jwtAccessSecret) as JwtPayload;

      const user = await db.query.users.findFirst({
        where: eq(schema.users.id, payload.userId),
        with: {
          chefProfile: true,
        },
      });

      if (!user || !user.isActive) {
        return reply.status(401).send({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'User not found or inactive' },
        });
      }

      return reply.send({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          phone: user.phone,
          avatarUrl: user.avatarUrl,
          emailVerified: user.emailVerified,
          chefProfile: user.chefProfile,
          createdAt: user.createdAt,
        },
      });
    } catch {
      return reply.status(401).send({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token' },
      });
    }
  });

  // Logout (just invalidate on client - stateless JWT)
  fastify.post('/logout', async (_, reply) => {
    return reply.send({
      success: true,
      data: { message: 'Logged out successfully' },
    });
  });

  // Forgot password
  fastify.post<{ Body: { email: string } }>('/forgot-password', async (request, reply) => {
    const validation = forgotPasswordSchema.safeParse(request.body);
    if (!validation.success) {
      return reply.status(400).send({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid email' },
      });
    }

    const { email } = validation.data;

    const user = await db.query.users.findFirst({
      where: eq(schema.users.email, email.toLowerCase()),
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return reply.send({
        success: true,
        data: { message: 'If an account exists, a password reset email has been sent' },
      });
    }

    // Generate reset token
    const resetToken = nanoid(32);
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour

    await db
      .update(schema.users)
      .set({
        passwordResetToken: resetToken,
        passwordResetExpires: resetExpires,
      })
      .where(eq(schema.users.id, user.id));

    // TODO: Send email with reset link
    // In production, use a proper email service

    return reply.send({
      success: true,
      data: { message: 'If an account exists, a password reset email has been sent' },
    });
  });

  // Reset password
  fastify.post<{ Body: { token: string; password: string } }>(
    '/reset-password',
    async (request, reply) => {
      const validation = resetPasswordSchema.safeParse(request.body);
      if (!validation.success) {
        return reply.status(400).send({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input',
            details: validation.error.flatten().fieldErrors,
          },
        });
      }

      const { token, password } = validation.data;

      const user = await db.query.users.findFirst({
        where: eq(schema.users.passwordResetToken, token),
      });

      if (!user || !user.passwordResetExpires || user.passwordResetExpires < new Date()) {
        return reply.status(400).send({
          success: false,
          error: {
            code: 'INVALID_TOKEN',
            message: 'Invalid or expired reset token',
          },
        });
      }

      const passwordHash = await argon2.hash(password);

      await db
        .update(schema.users)
        .set({
          passwordHash,
          passwordResetToken: null,
          passwordResetExpires: null,
        })
        .where(eq(schema.users.id, user.id));

      return reply.send({
        success: true,
        data: { message: 'Password reset successfully' },
      });
    }
  );
};
