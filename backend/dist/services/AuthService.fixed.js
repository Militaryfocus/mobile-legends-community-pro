"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = exports.AuthError = void 0;
// backend/src/services/AuthService.ts - FIXED VERSION
const bcrypt = __importStar(require("bcryptjs"));
const jwt = __importStar(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const JWT_SECRET = "dev_jwt_secret_2024";
const JWT_REFRESH_SECRET = "dev_jwt_refresh_secret_2024";
class AuthError extends Error {
    constructor(message, statusCode = 500, details) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        this.name = 'AuthError';
    }
}
exports.AuthError = AuthError;
class AuthService {
    async register(data) {
        const { email, password, username, gameNickname, gameServer, gameId, mainRole } = data;
        if (!this.isValidEmail(email)) {
            throw new AuthError('Invalid email format', 400);
        }
        const existingUser = await prisma.user.findFirst({
            where: { OR: [{ email }, { username }] }
        });
        if (existingUser) {
            if (existingUser.email === email)
                throw new AuthError('Email already registered', 409);
            if (existingUser.username === username)
                throw new AuthError('Username already taken', 409);
        }
        if (gameNickname) {
            const existingGameUser = await prisma.user.findFirst({ where: { gameNickname } });
            if (existingGameUser)
                throw new AuthError('Game nickname already taken', 409);
        }
        const passwordHash = await bcrypt.hash(password, 12);
        const user = await prisma.user.create({
            data: { email, passwordHash, username, role: 'USER', gameNickname, gameServer, gameId, mainRole },
            select: this.getUserSelectFields()
        });
        const { accessToken, refreshToken } = await this.generateTokens(user.id);
        return { user, accessToken, refreshToken };
    }
    async login(data) {
        const { email, password } = data;
        const user = await prisma.user.findUnique({
            where: { email },
            select: { ...this.getUserSelectFields(), passwordHash: true }
        });
        if (!user || !user.passwordHash)
            throw new AuthError('Invalid email or password', 401);
        const isValidPassword = await bcrypt.compare(password, user.passwordHash);
        if (!isValidPassword)
            throw new AuthError('Invalid email or password', 401);
        const { accessToken, refreshToken } = await this.generateTokens(user.id);
        const { passwordHash, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, accessToken, refreshToken };
    }
    async refreshToken(refreshToken) {
        try {
            const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
            const user = await prisma.user.findUnique({ where: { id: payload.userId }, select: { id: true } });
            if (!user)
                throw new AuthError('User not found', 401);
            const accessToken = this.generateAccessToken(user.id);
            return { accessToken };
        }
        catch (error) {
            throw new AuthError('Invalid refresh token', 401);
        }
    }
    async validateToken(token) {
        try {
            const payload = jwt.verify(token, JWT_SECRET);
            return payload;
        }
        catch (error) {
            throw new AuthError('Invalid token', 401);
        }
    }
    async getUserProfile(userId) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: this.getUserSelectFields()
        });
        if (!user)
            throw new AuthError('User not found', 404);
        return user;
    }
    async generateTokens(userId) {
        const accessToken = this.generateAccessToken(userId);
        const refreshToken = this.generateRefreshToken(userId);
        await prisma.session.create({
            data: { userId, token: refreshToken, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }
        });
        return { accessToken, refreshToken };
    }
    generateAccessToken(userId) {
        return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '15m' });
    }
    generateRefreshToken(userId) {
        return jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: '30d' });
    }
    getUserSelectFields() {
        return {
            id: true, email: true, username: true, role: true, avatar: true,
            isVerified: true, gameAccountVerified: true, gameNickname: true,
            gameServer: true, gameId: true, mainRole: true, rankTier: true, createdAt: true
        };
    }
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
//# sourceMappingURL=AuthService.fixed.js.map