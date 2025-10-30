import { Router } from 'express';
import { playerStatsController } from '../controllers/PlayerStatsController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', playerStatsController.getPlayerStats);
router.post('/', authenticateToken, playerStatsController.updatePlayerStats);
router.get('/hero/:heroId', playerStatsController.getHeroStats);
router.get('/rank-progress', authenticateToken, playerStatsController.getRankProgress);
router.get('/compare', authenticateToken, playerStatsController.getPlayerComparison);
router.get('/leaderboard', playerStatsController.getLeaderboard);

export default router;
