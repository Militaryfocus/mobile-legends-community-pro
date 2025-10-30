const fs = require('fs');
const filePath = './src/controllers/AuthController.ts';

// Создаем чистую версию с cookies
const newContent = `// backend/src/controllers/AuthController.ts
import { Request, Response, NextFunction } from 'express';
import { authService, AuthError } from '../services/AuthService';
import { AuthRequest } from '../middleware/authMiddleware';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, username, gameNickname, gameServer, gameId, mainRole } = req.body;

      const result = await authService.register({
        email,
        password,
        username,
        gameNickname,
        gameServer,
        gameId,
        mainRole
      });

      res.status(201).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const result = await authService.login({
        email,
        password
      });

      // SET COOKIES
      res.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000
      });

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.json({
        success: true,
        data: {
          user: result.user,
          accessToken: result.accessToken
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;

      const result = await authService.refreshToken(refreshToken);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (req.user && token) {
        await authService.logout(req.user.userId, token);
      }

      res.json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await authService.getUserById(req.user!.userId);

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { username, avatar, gameNickname, gameServer, mainRole } = req.body;

      const user = await authService.updateUser(req.user!.userId, {
        username,
        avatar,
        gameNickname,
        gameServer,
        mainRole
      });

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyGameAccount(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { gameNickname, gameServer, gameId } = req.body;

      const result = await authService.verifyGameAccount(req.user!.userId, {
        gameNickname,
        gameServer,
        gameId
      });

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
`;

fs.writeFileSync(filePath, newContent);
console.log('✅ AuthController полностью восстановлен с cookie поддержкой!');
