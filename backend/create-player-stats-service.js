const fs = require('fs');

console.log('📊 СОЗДАНИЕ PLAYER STATS SERVICE ДЛЯ MOBILE LEGENDS\\n');

const playerStatsService = `
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface PlayerStatsFilters {
  timeframe?: 'day' | 'week' | 'month' | 'season';
  heroId?: string;
  gameMode?: 'CLASSIC' | 'RANKED' | 'BRAWLS' | 'VS_AI';
  rankTier?: string;
}

export interface PlayerStatsSummary {
  totalMatches: number;
  totalWins: number;
  winRate: number;
  averageKDA: number;
  favoriteHero: string;
  rankProgress: number;
  bestStreak: number;
}

export class PlayerStatsService {
  
  async getPlayerStats(userId: string, filters: PlayerStatsFilters = {}) {
    // Полная статистика игрока
    const stats = await prisma.playerStats.findMany({
      where: {
        userId,
        ...this.buildFilters(filters)
      },
      include: {
        hero: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return this.calculateSummary(stats);
  }

  async getHeroStats(userId: string, heroId: string) {
    // Статистика по конкретному герою
    return await prisma.playerStats.findMany({
      where: {
        userId,
        heroId
      },
      include: {
        hero: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async getRankProgress(userId: string) {
    // Прогресс ранга игрока
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        rankTier: true,
        gameId: true
      }
    });

    if (!user?.rankTier) return null;

    const rankProgress = await prisma.playerStats.aggregate({
      where: {
        userId,
        gameMode: 'RANKED',
        createdAt: this.getTimeframeFilter('season')
      },
      _avg: {
        winRate: true
      },
      _count: {
        matches: true
      },
      _sum: {
        wins: true
      }
    });

    return {
      currentRank: user.rankTier,
      matchesPlayed: rankProgress._count.matches,
      winRate: rankProgress._avg.winRate,
      totalWins: rankProgress._sum.wins,
      stars: this.calculateStars(user.rankTier, rankProgress._sum.wins || 0)
    };
  }

  async updatePlayerStats(userId: string, gameData: any) {
    // Обновление статистики после игры
    const { heroId, result, kda, gameMode, duration } = gameData;

    return await prisma.playerStats.create({
      data: {
        userId,
        heroId,
        matches: 1,
        wins: result === 'WIN' ? 1 : 0,
        winRate: result === 'WIN' ? 100 : 0,
        kda,
        gameMode,
        duration,
        goldPerMinute: gameData.goldPerMinute || 0,
        towerDamage: gameData.towerDamage || 0,
        heroDamage: gameData.heroDamage || 0,
        damageTaken: gameData.damageTaken || 0,
        createdAt: new Date()
      }
    });
  }

  async getPlayerComparison(userId1: string, userId2: string) {
    // Сравнение двух игроков
    const [stats1, stats2] = await Promise.all([
      this.getPlayerStats(userId1),
      this.getPlayerStats(userId2)
    ]);

    return {
      player1: stats1,
      player2: stats2,
      comparison: this.compareStats(stats1, stats2)
    };
  }

  async getLeaderboard(metric: string = 'winRate', limit: number = 50) {
    // Лидерборд игроков
    const stats = await prisma.playerStats.groupBy({
      by: ['userId'],
      where: {
        matches: { gte: 10 } // Минимум 10 матчей
      },
      _avg: {
        winRate: true,
        kda: true
      },
      _sum: {
        matches: true,
        wins: true
      },
      orderBy: {
        _avg: {
          [metric]: 'desc'
        }
      },
      take: limit
    });

    // Добавляем информацию о пользователях
    const users = await prisma.user.findMany({
      where: {
        id: { in: stats.map(s => s.userId) }
      },
      select: {
        id: true,
        username: true,
        avatar: true,
        rankTier: true,
        gameNickname: true
      }
    });

    return stats.map(stat => ({
      ...stat,
      user: users.find(u => u.id === stat.userId)
    }));
  }

  private buildFilters(filters: PlayerStatsFilters) {
    const where: any = {};

    if (filters.timeframe) {
      where.createdAt = this.getTimeframeFilter(filters.timeframe);
    }

    if (filters.heroId) {
      where.heroId = filters.heroId;
    }

    if (filters.gameMode) {
      where.gameMode = filters.gameMode;
    }

    if (filters.rankTier) {
      where.user = {
        rankTier: filters.rankTier
      };
    }

    return where;
  }

  private getTimeframeFilter(timeframe: string) {
    const now = new Date();
    const filters = {
      'day': { gte: new Date(now.setDate(now.getDate() - 1)) },
      'week': { gte: new Date(now.setDate(now.getDate() - 7)) },
      'month': { gte: new Date(now.setMonth(now.getMonth() - 1)) },
      'season': { gte: new Date(now.setMonth(now.getMonth() - 3)) }
    };
    return filters[timeframe] || filters.month;
  }

  private calculateStars(rankTier: string, wins: number): number {
    const starMap = {
      'WARRIOR': Math.floor(wins / 5),
      'ELITE': Math.floor(wins / 6),
      'MASTER': Math.floor(wins / 7),
      'GRANDMASTER': Math.floor(wins / 8),
      'EPIC': Math.floor(wins / 9),
      'LEGEND': Math.floor(wins / 10),
      'MYTHIC': Math.floor(wins / 12),
      'MYTHIC_HONOR': Math.floor(wins / 15),
      'MYTHIC_IMMORTAL': Math.floor(wins / 20)
    };
    return starMap[rankTier] || 0;
  }

  private calculateSummary(stats: any[]): PlayerStatsSummary {
    const totalMatches = stats.reduce((sum, stat) => sum + stat.matches, 0);
    const totalWins = stats.reduce((sum, stat) => sum + stat.wins, 0);
    const winRate = totalMatches > 0 ? (totalWins / totalMatches) * 100 : 0;
    
    const averageKDA = stats.length > 0 
      ? stats.reduce((sum, stat) => sum + stat.kda, 0) / stats.length 
      : 0;

    // Самый популярный герой
    const heroCounts = stats.reduce((acc, stat) => {
      acc[stat.heroId] = (acc[stat.heroId] || 0) + stat.matches;
      return acc;
    }, {});

    const favoriteHero = Object.entries(heroCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || '';

    return {
      totalMatches,
      totalWins,
      winRate,
      averageKDA,
      favoriteHero,
      rankProgress: 0, // Рассчитывается отдельно
      bestStreak: this.calculateBestStreak(stats)
    };
  }

  private calculateBestStreak(stats: any[]): number {
    let currentStreak = 0;
    let bestStreak = 0;

    stats.forEach(stat => {
      if (stat.winRate === 100) {
        currentStreak += stat.matches;
        bestStreak = Math.max(bestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    });

    return bestStreak;
  }

  private compareStats(stats1: PlayerStatsSummary, stats2: PlayerStatsSummary) {
    return {
      winRateDiff: stats1.winRate - stats2.winRate,
      kdaDiff: stats1.averageKDA - stats2.averageKDA,
      matchesDiff: stats1.totalMatches - stats2.totalMatches,
      favoriteHeroSame: stats1.favoriteHero === stats2.favoriteHero
    };
  }
}

export const playerStatsService = new PlayerStatsService();
`;

fs.writeFileSync('src/services/PlayerStatsService.ts', playerStatsService);
console.log('✅ НОВЫЙ СЕРВИС СОЗДАН: src/services/PlayerStatsService.ts');

console.log('\\n🎯 ВОЗМОЖНОСТИ PLAYER STATS SERVICE:');
console.log('   - Полная статистика игрока');
console.log('   - Статистика по героям');
console.log('   - Прогресс ранга и звезды');
console.log('   - Обновление после игр');
console.log('   - Сравнение игроков');
console.log('   - Лидерборды по разным метрикам');
console.log('   - Фильтры по времени, героям, режимам');
