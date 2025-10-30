import { UserRole } from '@prisma/client';
export interface RegisterData {
    email: string;
    password: string;
    username: string;
    gameNickname?: string;
    gameServer?: string;
    gameId?: string;
    mainRole?: string;
}
export interface LoginData {
    email: string;
    password: string;
}
export interface AuthResponse {
    user: {
        id: string;
        email: string;
        username: string;
        role: UserRole;
        avatar?: string | null;
        isVerified: boolean;
        gameAccountVerified: boolean;
        gameNickname?: string | null;
        gameServer?: string | null;
        gameId?: string | null;
        mainRole?: string | null;
        rankTier?: string | null;
        createdAt: Date;
    };
    accessToken: string;
    refreshToken: string;
}
export declare class AuthError extends Error {
    statusCode: number;
    details?: any;
    constructor(message: string, statusCode?: number, details?: any);
}
export declare class AuthService {
    register(data: RegisterData): Promise<AuthResponse>;
    login(data: LoginData): Promise<AuthResponse>;
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
    }>;
    validateToken(token: string): Promise<{
        userId: string;
    }>;
    getUserProfile(userId: string): Promise<{
        email: string;
        username: string;
        gameNickname: string | null;
        id: string;
        role: import(".prisma/client").$Enums.UserRole;
        avatar: string | null;
        isVerified: boolean;
        gameAccountVerified: boolean;
        gameServer: string | null;
        gameId: string | null;
        mainRole: string | null;
        rankTier: string | null;
        createdAt: Date;
    }>;
    private generateTokens;
    private generateAccessToken;
    private generateRefreshToken;
    private getUserSelectFields;
    private isValidEmail;
}
export declare const authService: AuthService;
//# sourceMappingURL=AuthService.fixed.d.ts.map