import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class PlayerStatsService {
  async getPlayerStats(userId: string) {
    return await prisma.playerStats.findMany({
      where: { userId },
      include: { user: true, hero: true },
      orderBy: { updatedAt: 'desc' }
    });
  }

  async getHeroStats(userId: string, heroId: string) {
    return await prisma.playerStats.findMany({
      where: { userId, heroId },
      include: { user: true, hero: true },
      orderBy: { updatedAt: 'desc' }
    });
  }

  async getRankProgress(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    return {
      currentRank: user.rankTier,
      stars: 0,
      matchesPlayed: 0,
      winRate: 0,
      totalWins: 0
    };
  }

  async updatePlayerStats(userId: string, heroId: string, result: string, kills: number, deaths: number, assists: number) {
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

  async getPlayerComparison(userId: string, heroId: string) {
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

  async getLeaderboard(type: string = 'overall', limit: number = 100) {
    return await prisma.playerStats.findMany({
      include: { user: true, hero: true },
      orderBy: { kills: 'desc' },
      take: limit
    });
  }
}

export const playerStatsService = new PlayerStatsService();
