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
exports.authenticateTokenWithCookie = exports.optionalAuth = exports.authenticateToken = exports.AuthMiddlewareError = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const JWT_SECRET = "dev_jwt_secret_2024";
class AuthMiddlewareError extends Error {
    constructor(message, statusCode = 401) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'AuthMiddlewareError';
    }
}
exports.AuthMiddlewareError = AuthMiddlewareError;
const authenticateToken = async (req, res, next) => {
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
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('✅ JWT validation successful for user:', decoded.userId);
        req.user = { userId: decoded.userId };
        next();
    }
    catch (error) {
        console.log('❌ JWT validation failed:', error.message);
        console.log('🔍 Error details:', error);
        next(new AuthMiddlewareError('Invalid or expired token', 401));
    }
};
exports.authenticateToken = authenticateToken;
const optionalAuth = async (req, res, next) => {
    try {
        let token = req.cookies?.accessToken;
        if (!token) {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7);
            }
        }
        if (token) {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = { userId: decoded.userId };
        }
        next();
    }
    catch (error) {
        next();
    }
};
exports.optionalAuth = optionalAuth;
const authenticateTokenWithCookie = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken;
        if (!token) {
            throw new AuthMiddlewareError('Access token required', 401);
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = { userId: decoded.userId };
        next();
    }
    catch (error) {
        next(new AuthMiddlewareError('Invalid or expired token', 401));
    }
};
exports.authenticateTokenWithCookie = authenticateTokenWithCookie;
//# sourceMappingURL=authMiddleware.js.map