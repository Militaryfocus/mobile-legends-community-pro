"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
class AuthService {
    async register(data) {
        const { email, password, username, gameNickname } = data;
        const existingUser = await prisma.user.findFirst({
            where: { OR: [{ email }, { username }] }
        });
        if (existingUser) {
            throw new Error('User with this email or username already exists');
        }
        const passwordHash = await bcryptjs_1.default.hash(password, 12);
        const user = await prisma.user.create({
            data: { email, username, passwordHash, gameNickname, role: client_1.UserRole.USER }
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
    async login(email, password) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.passwordHash)
            throw new Error('Invalid credentials');
        const isValidPassword = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isValidPassword)
            throw new Error('Invalid credentials');
        const accessToken = this.generateAccessToken(user);
        const refreshToken = this.generateAccessToken(user);
        const { passwordHash: _, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, accessToken, refreshToken };
    }
    async refreshToken(refreshToken) {
        try {
            const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_SECRET || 'fallback-secret');
            const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
            if (!user)
                throw new Error('User not found');
            const newAccessToken = this.generateAccessToken(user);
            const newRefreshToken = this.generateAccessToken(user);
            const { passwordHash: _, ...userWithoutPassword } = user;
            return { user: userWithoutPassword, accessToken: newAccessToken, refreshToken: newRefreshToken };
        }
        catch (error) {
            throw new Error('Invalid or expired refresh token');
        }
    }
    async logout(userId, token) {
        // временно ничего не делаем
    }
    async getUserProfile(userId) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true, email: true, username: true, role: true, avatar: true,
                isVerified: true, gameAccountVerified: true, gameNickname: true,
                gameServer: true, rankTier: true, createdAt: true, updatedAt: true
            }
        });
        if (!user)
            throw new Error('User not found');
        return user;
    }
    async validateToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'fallback-secret');
        }
        catch (error) {
            throw new Error('Invalid token');
        }
    }
    generateAccessToken(user) {
        return jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '7d' });
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
//# sourceMappingURL=AuthService.js.map