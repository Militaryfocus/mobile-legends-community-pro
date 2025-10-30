import { Router } from 'express';
import { buildController } from '../controllers/BuildController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', buildController.getAllBuilds);
router.get('/recommended', buildController.getRecommendedBuilds);
router.get('/pro', buildController.getProBuilds);
router.get('/:id', buildController.getBuildById);
router.post('/', authenticateToken, buildController.createBuild);
router.put('/:id', authenticateToken, buildController.updateBuild);
router.delete('/:id', authenticateToken, buildController.deleteBuild);
router.post('/:id/vote', authenticateToken, buildController.voteBuild);

export default router;
