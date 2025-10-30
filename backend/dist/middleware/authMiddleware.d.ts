import { Request } from 'express';
export interface AuthRequest extends Request {
    user?: {
        userId: string;
    };
}
export declare class AuthMiddlewareError extends Error {
    statusCode: number;
    constructor(message: string, statusCode?: number);
}
export declare const authenticateToken: (req: AuthRequest, res: any, next: any) => Promise<void>;
export declare const optionalAuth: (req: AuthRequest, res: any, next: any) => Promise<void>;
export declare const authenticateTokenWithCookie: (req: AuthRequest, res: any, next: any) => Promise<void>;
//# sourceMappingURL=authMiddleware.d.ts.map