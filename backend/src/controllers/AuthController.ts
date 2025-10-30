import { AuthenticatedRequest } from "../middleware/auth";
import { Request, Response } from 'express';
import { authService } from '../services/AuthService';

export class AuthController {
  async register(req: AuthenticatedRequest, res: Response) {
    try {
      const { email, password, username, gameNickname } = req.body;

      const result = await authService.register({
        email,
        password,
        username,
        gameNickname
      });

      res.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 15 * 60 * 1000 // 15 minutes
      });

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: result.user,
          accessToken: result.accessToken
        }
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async login(req: AuthenticatedRequest, res: Response) {
    try {
      const { email, password } = req.body;

      const result = await authService.login(email, password);

      res.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 15 * 60 * 1000 // 15 minutes
      });

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: result.user,
          accessToken: result.accessToken
        }
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }

  async refreshToken(req: AuthenticatedRequest, res: Response) {
    try {
      const { refreshToken } = req.cookies;

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: 'Refresh token required'
        });
      }

      const result = await authService.refreshToken(refreshToken);

      res.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 15 * 60 * 1000
      });

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.json({
        success: true,
        message: 'Token refreshed successfully',
        data: {
          user: result.user,
          accessToken: result.accessToken
        }
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }

  async logout(req: AuthenticatedRequest, res: Response) {

    if (!req.user) return res.status(401).json({ success: false, message: "User not authenticated" });
    try {
      const token = req.cookies.accessToken;
      
      await authService.logout(req.user?.userId, token);

      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');

      res.json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getProfile(req: AuthenticatedRequest, res: Response) {

    if (!req.user) return res.status(401).json({ success: false, message: "User not authenticated" });
    try {
      const user = await authService.getUserProfile(req.user?.userId);
      
      res.json({
        success: true,
        data: { user }
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }
}

export const authController = new AuthController();

// Add user validation checks
