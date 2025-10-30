"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PlayerStatsController_1 = require("../controllers/PlayerStatsController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Public routes
router.get('/leaderboard', authMiddleware_1.optionalAuth, PlayerStatsController_1.playerStatsController.getLeaderboard);
// Protected routes  
router.get('/:id', authMiddleware_1.authenticateToken, PlayerStatsController_1.playerStatsController.getPlayerStats);
router.get('/:userId/hero/:heroId', authMiddleware_1.authenticateToken, PlayerStatsController_1.playerStatsController.getHeroStats);
router.get('/:id/rank-progress', authMiddleware_1.authenticateToken, PlayerStatsController_1.playerStatsController.getRankProgress);
router.post('/:id/game', authMiddleware_1.authenticateToken, PlayerStatsController_1.playerStatsController.updatePlayerStats);
router.get('/compare/:userId1/:userId2', authMiddleware_1.authenticateToken, PlayerStatsController_1.playerStatsController.getPlayerComparison);
exports.default = router;
//# sourceMappingURL=stats.improved.js.map