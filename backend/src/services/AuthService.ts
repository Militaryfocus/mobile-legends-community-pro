import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export interface RegisterData {
  email: string;
  password: string;
  username: string;
  gameNickname?: string;
}

export interface LoginResponse {
  user: any;
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  async register(data: RegisterData): Promise<LoginResponse> {
    const { email, password, username, gameNickname } = data;

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] }
    });

    if (existingUser) {
      throw new Error('User with this email or username already exists');
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, username, passwordHash, gameNickname, role: UserRole.USER }
    });

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateAccessToken(user); // временно используем тот же токен

    const { passwordHash: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken
    };
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) throw new Error('Invalid credentials');

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) throw new Error('Invalid credentials');

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateAccessToken(user);

    const { passwordHash: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET || 'fallback-secret') as any;
      const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
      
      if (!user) throw new Error('User not found');

      const newAccessToken = this.generateAccessToken(user);
      const newRefreshToken = this.generateAccessToken(user);

      const { passwordHash: _, ...userWithoutPassword } = user;
      return { user: userWithoutPassword, accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  async logout(userId: string, token: string) {
    // временно ничего не делаем
  }

  async getUserProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, email: true, username: true, role: true, avatar: true,
        isVerified: true, gameAccountVerified: true, gameNickname: true,
        gameServer: true, rankTier: true, createdAt: true, updatedAt: true
      }
    });

    if (!user) throw new Error('User not found');
    return user;
  }

  async validateToken(token: string) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  private generateAccessToken(user: any): string {
    return jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );
  }
}

export const authService = new AuthService();
