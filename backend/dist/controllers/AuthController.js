"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const AuthService_1 = require("../services/AuthService");
class AuthController {
    async register(req, res) {
        try {
            const { email, password, username, gameNickname } = req.body;
            const result = await AuthService_1.authService.register({
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
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const result = await AuthService_1.authService.login(email, password);
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
        }
        catch (error) {
            res.status(401).json({
                success: false,
                message: error.message
            });
        }
    }
    async refreshToken(req, res) {
        try {
            const { refreshToken } = req.cookies;
            if (!refreshToken) {
                return res.status(401).json({
                    success: false,
                    message: 'Refresh token required'
                });
            }
            const result = await AuthService_1.authService.refreshToken(refreshToken);
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
        }
        catch (error) {
            res.status(401).json({
                success: false,
                message: error.message
            });
        }
    }
    async logout(req, res) {
        if (!req.user)
            return res.status(401).json({ success: false, message: "User not authenticated" });
        try {
            const token = req.cookies.accessToken;
            await AuthService_1.authService.logout(req.user?.userId, token);
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            res.json({
                success: true,
                message: 'Logout successful'
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
    async getProfile(req, res) {
        if (!req.user)
            return res.status(401).json({ success: false, message: "User not authenticated" });
        try {
            const user = await AuthService_1.authService.getUserProfile(req.user?.userId);
            res.json({
                success: true,
                data: { user }
            });
        }
        catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
// Add user validation checks
//# sourceMappingURL=AuthController.js.map