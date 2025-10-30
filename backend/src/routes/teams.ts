import { Router } from 'express';
import { teamController } from '../controllers/TeamController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/', teamController.getAllTeams);
router.post('/', authenticateToken, teamController.createTeam);
router.get('/:id', teamController.getTeamById);
router.post('/:id/join', authenticateToken, teamController.joinTeam);

export default router;
