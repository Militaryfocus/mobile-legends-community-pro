// backend/src/routes/auth.ts
import { Router } from 'express';
import { authController } from '../controllers/AuthController';
import {
  validateRegister,
  validateLogin,
  validateRefreshToken,
  handleValidationErrors
} from '../middleware/validationMiddleware';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.post(
  '/register',
  validateRegister,
  handleValidationErrors,
  authController.register
);

router.post(
  '/login',
  validateLogin,
  handleValidationErrors,
  authController.login
);

router.post(
  '/refresh-token',
  validateRefreshToken,
  handleValidationErrors,
  authController.refreshToken
);

// Protected routes
router.post(
  '/logout',
  authenticateToken,
  authController.logout
);

router.get(
  '/profile',
  authenticateToken,
  authController.getProfile
);

export default router;
