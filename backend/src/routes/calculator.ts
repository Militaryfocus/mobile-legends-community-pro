import { Router } from 'express';
import { calculatorController } from '../controllers/CalculatorController';

const router = Router();

router.post('/calculate', calculatorController.calculateBuild);
router.post('/compare', calculatorController.compareBuilds);
router.get('/optimal', calculatorController.getOptimalBuild);
router.post('/synergies', calculatorController.getSynergyRecommendations);

export default router;
