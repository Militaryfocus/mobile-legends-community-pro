"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/auth.ts
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Public routes
router.post('/register', validationMiddleware_1.validateRegister, validationMiddleware_1.handleValidationErrors, AuthController_1.authController.register);
router.post('/login', validationMiddleware_1.validateLogin, validationMiddleware_1.handleValidationErrors, AuthController_1.authController.login);
router.post('/refresh-token', validationMiddleware_1.validateRefreshToken, validationMiddleware_1.handleValidationErrors, AuthController_1.authController.refreshToken);
// Protected routes
router.post('/logout', authMiddleware_1.authenticateToken, AuthController_1.authController.logout);
router.get('/profile', authMiddleware_1.authenticateToken, AuthController_1.authController.getProfile);
exports.default = router;
//# sourceMappingURL=auth.js.map