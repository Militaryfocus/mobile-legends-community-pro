import { Router } from 'express';
import authRouter from './auth';
import heroesRouter from './heroes';
import buildsRouter from './builds';
import statsRouter from './stats';
import calculatorRouter from './calculator';

const router = Router();

router.use('/api/auth', authRouter);
router.use('/api/heroes', heroesRouter);
router.use('/api/builds', buildsRouter);
router.use('/api/stats', statsRouter);
router.use('/api/calculator', calculatorRouter);

router.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

export default router;
