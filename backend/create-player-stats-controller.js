const fs = require('fs');

console.log('📊 СОЗДАНИЕ PLAYER STATS CONTROLLER\\n');

const playerStatsController = `
import { playerStatsService } from '../services/PlayerStatsService';
import { authenticateToken } from '../middleware/authMiddleware';

export const playerStatsController = {

  async getPlayerStats(req: any, res: any) {
    try {
      const { id } = req.params;
      const filters = req.query;
      
      const stats = await playerStatsService.getPlayerStats(id, filters);
      res.json({ success: true, data: stats });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  },

  async getHeroStats(req: any, res: any) {
    try {
      const { userId, heroId } = req.params;
      
      const stats = await playerStatsService.getHeroStats(userId, heroId);
      res.json({ success: true, data: stats });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  },

  async getRankProgress(req: any, res: any) {
    try {
      const { id } = req.params;
      
      const progress = await playerStatsService.getRankProgress(id);
      res.json({ success: true, data: progress });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  },

  async updatePlayerStats(req: any, res: any) {
    try {
      const { id } = req.params;
      const gameData = req.body;
      
      const stats = await playerStatsService.updatePlayerStats(id, gameData);
      res.json({ success: true, data: stats });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  },

  async getPlayerComparison(req: any, res: any) {
    try {
      const { userId1, userId2 } = req.params;
      
      const comparison = await playerStatsService.getPlayerComparison(userId1, userId2);
      res.json({ success: true, data: comparison });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  },

  async getLeaderboard(req: any, res: any) {
    try {
      const { metric = 'winRate', limit = 50 } = req.query;
      
      const leaderboard = await playerStatsService.getLeaderboard(metric, parseInt(limit));
      res.json({ success: true, data: leaderboard });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  }
};
`;

fs.writeFileSync('src/controllers/PlayerStatsController.ts', playerStatsController);
console.log('✅ КОНТРОЛЛЕР СОЗДАН: src/controllers/PlayerStatsController.ts');

// Создаем роуты для PlayerStats
const playerStatsRoutes = `
import { Router } from 'express';
import { playerStatsController } from '../controllers/PlayerStatsController';
import { authenticateToken, optionalAuth } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.get('/leaderboard', optionalAuth, playerStatsController.getLeaderboard);

// Protected routes  
router.get('/:id', authenticateToken, playerStatsController.getPlayerStats);
router.get('/:userId/hero/:heroId', authenticateToken, playerStatsController.getHeroStats);
router.get('/:id/rank-progress', authenticateToken, playerStatsController.getRankProgress);
router.post('/:id/game', authenticateToken, playerStatsController.updatePlayerStats);
router.get('/compare/:userId1/:userId2', authenticateToken, playerStatsController.getPlayerComparison);

export default router;
`;

fs.writeFileSync('src/routes/stats.improved.ts', playerStatsRoutes);
console.log('✅ РОУТЫ СОЗДАНЫ: src/routes/stats.improved.ts');

console.log('\\n🎯 ENDPOINTS PLAYER STATS:');
console.log('GET /api/stats/leaderboard        - Лидерборд игроков');
console.log('GET /api/stats/:id                - Статистика игрока');
console.log('GET /api/stats/:userId/hero/:heroId - Статистика по герою');
console.log('GET /api/stats/:id/rank-progress  - Прогресс ранга');
console.log('POST /api/stats/:id/game          - Обновление после игры');
console.log('GET /api/stats/compare/:userId1/:userId2 - Сравнение игроков');
