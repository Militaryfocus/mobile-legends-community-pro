"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playerStatsController = exports.PlayerStatsController = void 0;
const PlayerStatsService_1 = require("../services/PlayerStatsService");
class PlayerStatsController {
    async getPlayerStats(req, res) {
        try {
            if (!req.user)
                return res.status(401).json({ success: false, message: "User not authenticated" });
            const stats = await PlayerStatsService_1.playerStatsService.getPlayerStats(req.user.userId);
            res.json({
                success: true,
                data: stats
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
    async getHeroStats(req, res) {
        try {
            const { heroId } = req.params;
            const stats = await PlayerStatsService_1.playerStatsService.getHeroStats("", heroId);
            res.json({
                success: true,
                data: stats
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
    async getRankProgress(req, res) {
        try {
            if (!req.user)
                return res.status(401).json({ success: false, message: "User not authenticated" });
            const progress = await PlayerStatsService_1.playerStatsService.getRankProgress(req.user.userId);
            res.json({
                success: true,
                data: progress
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
    async updatePlayerStats(req, res) {
        try {
            if (!req.user)
                return res.status(401).json({ success: false, message: "User not authenticated" });
            const { heroId, result, kills, deaths, assists } = req.body;
            const stats = await PlayerStatsService_1.playerStatsService.updatePlayerStats(req.user.userId, heroId, result, kills, deaths, assists);
            res.json({
                success: true,
                message: 'Stats updated successfully',
                data: stats
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
    async getPlayerComparison(req, res) {
        try {
            if (!req.user)
                return res.status(401).json({ success: false, message: "User not authenticated" });
            const { heroId } = req.query;
            const comparison = await PlayerStatsService_1.playerStatsService.getPlayerComparison(req.user.userId, heroId);
            res.json({
                success: true,
                data: comparison
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
    async getLeaderboard(req, res) {
        try {
            const { type = 'overall', limit = '100' } = req.query;
            const leaderboard = await PlayerStatsService_1.playerStatsService.getLeaderboard(type, parseInt(limit));
            res.json({
                success: true,
                data: leaderboard
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}
exports.PlayerStatsController = PlayerStatsController;
exports.playerStatsController = new PlayerStatsController();
//# sourceMappingURL=PlayerStatsController.js.map