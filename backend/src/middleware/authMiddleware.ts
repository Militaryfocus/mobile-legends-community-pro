import * as jwt from 'jsonwebtoken';
import { Request } from 'express';

const JWT_SECRET = "dev_jwt_secret_2024";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
  };
}

export class AuthMiddlewareError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 401) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AuthMiddlewareError';
  }
}

export const authenticateToken = async (req: AuthRequest, res: any, next: any) => {
  try {
    console.log('🟢 Auth middleware called for:', req.url);
    console.log('📋 Headers:', JSON.stringify(req.headers));
    
    let token = req.cookies?.accessToken;
    console.log('🔐 Token from cookies:', token ? 'present' : 'missing');
    
    // Check Authorization header
    if (!token) {
      console.log('❌ No token found in cookies, checking headers...');
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
        console.log('🔐 Token from headers:', token ? 'present' : 'missing');
      }
    }
    
    if (!token) {
      throw new AuthMiddlewareError('Access token required', 401);
    }

    console.log('🔍 JWT_SECRET:', process.env.JWT_SECRET ? 'set' : 'using hardcoded secret');
    console.log('🔍 Token to verify:', token.substring(0, 20) + '...');
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    console.log('✅ JWT validation successful for user:', decoded.userId);
    req.user = { userId: decoded.userId };
    next();
  } catch (error: any) {
    console.log('❌ JWT validation failed:', error.message);
    console.log('🔍 Error details:', error);
    next(new AuthMiddlewareError('Invalid or expired token', 401));
  }
};

export const optionalAuth = async (req: AuthRequest, res: any, next: any) => {
  try {
    let token = req.cookies?.accessToken;
    
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }
    
    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      req.user = { userId: decoded.userId };
    }
    next();
  } catch (error) {
    next();
  }
};

export const authenticateTokenWithCookie = async (req: AuthRequest, res: any, next: any) => {
  try {
    const token = req.cookies?.accessToken;
    if (!token) {
      throw new AuthMiddlewareError('Access token required', 401);
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = { userId: decoded.userId };
    next();
  } catch (error: any) {
    next(new AuthMiddlewareError('Invalid or expired token', 401));
  }
};
