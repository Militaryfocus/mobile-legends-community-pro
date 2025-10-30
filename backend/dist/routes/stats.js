"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PlayerStatsController_1 = require("../controllers/PlayerStatsController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/', PlayerStatsController_1.playerStatsController.getPlayerStats);
router.post('/', auth_1.authenticateToken, PlayerStatsController_1.playerStatsController.updatePlayerStats);
router.get('/hero/:heroId', PlayerStatsController_1.playerStatsController.getHeroStats);
router.get('/rank-progress', auth_1.authenticateToken, PlayerStatsController_1.playerStatsController.getRankProgress);
router.get('/compare', auth_1.authenticateToken, PlayerStatsController_1.playerStatsController.getPlayerComparison);
router.get('/leaderboard', PlayerStatsController_1.playerStatsController.getLeaderboard);
exports.default = router;
//# sourceMappingURL=stats.js.map