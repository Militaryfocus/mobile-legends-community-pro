"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playerStatsService = exports.PlayerStatsService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class PlayerStatsService {
    async getPlayerStats(userId) {
        return await prisma.playerStats.findMany({
            where: { userId },
            include: { user: true, hero: true },
            orderBy: { updatedAt: 'desc' }
        });
    }
    async getHeroStats(userId, heroId) {
        return await prisma.playerStats.findMany({
            where: { userId, heroId },
            include: { user: true, hero: true },
            orderBy: { updatedAt: 'desc' }
        });
    }
    async getRankProgress(userId) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new Error('User not found');
        return {
            currentRank: user.rankTier,
            stars: 0,
            matchesPlayed: 0,
            winRate: 0,
            totalWins: 0
        };
    }
    async updatePlayerStats(userId, heroId, result, kills, deaths, assists) {
        return await prisma.playerStats.create({
            data: {
                userId,
                heroId,
                matches: 1,
                wins: result === 'WIN' ? 1 : 0,
                kills,
                deaths,
                assists
            }
        });
    }
    async getPlayerComparison(userId, heroId) {
        const userStats = await prisma.playerStats.findFirst({
            where: { userId, heroId }
        });
        const globalStats = await prisma.playerStats.aggregate({
            where: { heroId },
            _avg: {
                kills: true,
                deaths: true,
                assists: true
            },
            _count: {
                _all: true
            }
        });
        const avg = globalStats._avg || {};
        const count = globalStats._count || {};
        return {
            userStats,
            globalStats: {
                avgKills: avg.kills || 0,
                avgDeaths: avg.deaths || 0,
                avgAssists: avg.assists || 0,
                totalMatches: count._all || 0
            }
        };
    }
    async getLeaderboard(type = 'overall', limit = 100) {
        return await prisma.playerStats.findMany({
            include: { user: true, hero: true },
            orderBy: { kills: 'desc' },
            take: limit
        });
    }
}
exports.PlayerStatsService = PlayerStatsService;
exports.playerStatsService = new PlayerStatsService();
//# sourceMappingURL=PlayerStatsService.js.map