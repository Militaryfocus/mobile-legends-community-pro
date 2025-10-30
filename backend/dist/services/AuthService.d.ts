import jwt from 'jsonwebtoken';
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
export declare class AuthService {
    register(data: RegisterData): Promise<LoginResponse>;
    login(email: string, password: string): Promise<LoginResponse>;
    refreshToken(refreshToken: string): Promise<LoginResponse>;
    logout(userId: string, token: string): Promise<void>;
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
        rankTier: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    validateToken(token: string): Promise<string | jwt.JwtPayload>;
    private generateAccessToken;
}
export declare const authService: AuthService;
//# sourceMappingURL=AuthService.d.ts.map