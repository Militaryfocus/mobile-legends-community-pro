// backend/src/routes/heroes.ts
import { Router } from 'express';
import { heroController } from '../controllers/HeroController';
import { optionalAuth } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.get('/', optionalAuth, heroController.getAllHeroes);
router.get('/search', optionalAuth, heroController.getAllHeroes);
router.get('/meta', optionalAuth, heroController.getHeroMetaStats);
router.get('/role/:role', optionalAuth, heroController.getHeroesByRole);
router.get('/:id', optionalAuth, heroController.getHeroById);

export default router;
