import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prisma/client';
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

const ACCESS_TOKEN_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_TOKEN_EXPIRES_DAYS = parseInt(process.env.REFRESH_TOKEN_DAYS || '7', 10);
const MILLISECONDS_PER_DAY = 86400000;

export const authService = {
  async register(email: string, password: string) {
    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) throw new Error('Email already in use');

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, passwordHash } });

    return user;
  },

  async login(email: string, password: string, res: Response) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new Error('Invalid credentials');
    }

    const accessToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: ACCESS_TOKEN_EXPIRES_IN } as jwt.SignOptions
    );

    const refreshToken = uuidv4();
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRES_DAYS * MILLISECONDS_PER_DAY);

    await prisma.refreshToken.create({
      data: { token: refreshToken, userId: user.id, expiresAt },
    });

    // Send refresh token as HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: REFRESH_TOKEN_EXPIRES_DAYS * MILLISECONDS_PER_DAY,
    });

    return { accessToken };
  },

  async refreshToken(oldToken: string, res: Response) {
    const stored = await prisma.refreshToken.findUnique({ where: { token: oldToken } });

    if (!stored || stored.expiresAt < new Date()) {
      throw new Error('Invalid or expired refresh token');
    }

    const user = await prisma.user.findUnique({ where: { id: stored.userId } });

    if (!user) throw new Error('User not found');

    // Invalidate old token
    await prisma.refreshToken.delete({ where: { token: oldToken } });

    // Issue new refresh token
    const newRefreshToken = uuidv4();
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRES_DAYS * MILLISECONDS_PER_DAY);

    await prisma.refreshToken.create({
      data: { token: newRefreshToken, userId: user.id, expiresAt },
    });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: REFRESH_TOKEN_EXPIRES_DAYS * MILLISECONDS_PER_DAY,
    });

    const accessToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: ACCESS_TOKEN_EXPIRES_IN } as jwt.SignOptions
    );

    return { accessToken };
  },

  async logout(refreshToken: string) {
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
  },
};
