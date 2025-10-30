const fs = require('fs');

console.log('🔧 УЛУЧШЕНИЕ BUILD SERVICE ДЛЯ MOBILE LEGENDS\\n');

const buildServicePath = 'src/services/BuildService.ts';
let buildService = fs.readFileSync(buildServicePath, 'utf8');

// Добавляем ML-специфичные методы
const improvedBuildService = buildService.replace(
  'export class BuildService {',
  `export class BuildService {
  // MLBB-специфичные методы для сборок

  async getBuildWinRate(buildId: string) {
    // Расчет винрейта сборки на основе статистики
    const build = await prisma.build.findUnique({
      where: { id: buildId },
      include: {
        playerStats: {
          select: {
            wins: true,
            matches: true
          }
        }
      }
    });

    if (!build || !build.playerStats.length) return 0;

    const totalWins = build.playerStats.reduce((sum, stat) => sum + stat.wins, 0);
    const totalMatches = build.playerStats.reduce((sum, stat) => sum + stat.matches, 0);
    
    return totalMatches > 0 ? (totalWins / totalMatches) * 100 : 0;
  }

  async getRecommendedBuilds(heroId: string, playstyle: string = 'BALANCED') {
    // Рекомендованные сборки для героя
    return await prisma.build.findMany({
      where: {
        heroId,
        playstyle: playstyle as any,
        isPublic: true
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        },
        hero: true,
        items: true,
        emblems: true,
        _count: {
          select: {
            votes: true,
            likes: true,
            comments: true
          }
        }
      },
      orderBy: [
        { winRate: 'desc' },
        { likeCount: 'desc' }
      ],
      take: 10
    });
  }

  async getProBuilds(heroId: string) {
    // Сборки от профессиональных игроков
    return await prisma.build.findMany({
      where: {
        heroId,
        author: {
          rankTier: {
            in: ['MYTHIC', 'MYTHIC_HONOR', 'MYTHIC_IMMORTAL']
          }
        },
        isPublic: true
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
            rankTier: true
          }
        },
        items: true,
        emblems: true
      },
      orderBy: {
        winRate: 'desc'
      },
      take: 5
    });
  }

  async calculateBuildSynergy(buildId: string) {
    // Расчет синергии предметов в сборке
    const build = await prisma.build.findUnique({
      where: { id: buildId },
      include: {
        items: true,
        emblems: true
      }
    });

    if (!build) return 0;

    let synergyScore = 0;
    const items = build.items;
    
    // Проверка синергии между предметами
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        if (this.hasSynergy(items[i], items[j])) {
          synergyScore += 10;
        }
      }
    }

    // Бонус за полный набор эмблем
    if (build.emblems.length >= 3) {
      synergyScore += 20;
    }

    return Math.min(synergyScore, 100);
  }

  async updateBuildStats(buildId: string) {
    // Обновление статистики сборки
    const winRate = await this.getBuildWinRate(buildId);
    const synergy = await this.calculateBuildSynergy(buildId);
    const popularity = await this.getBuildPopularity(buildId);

    return await prisma.build.update({
      where: { id: buildId },
      data: {
        winRate,
        popularity,
        synergyScore: synergy,
        updatedAt: new Date()
      }
    });
  }

  private hasSynergy(item1: any, item2: any): boolean {
    // Логика проверки синергии предметов
    const synergisticPairs = [
      ['Bloodlust Axe', 'War Axe'],
      ['Blade of Despair', 'Windtalker'],
      ['Thunder Belt', 'Brute Force Breastplate'],
      ['Immortality', 'Antique Cuirass']
    ];

    return synergisticPairs.some(pair => 
      (pair[0] === item1.name && pair[1] === item2.name) ||
      (pair[1] === item1.name && pair[0] === item2.name)
    );
  }

  private async getBuildPopularity(buildId: string): Promise<number> {
    // Расчет популярности сборки
    const stats = await prisma.build.findUnique({
      where: { id: buildId },
      select: {
        viewCount: true,
        likeCount: true,
        copyCount: true,
        _count: {
          select: {
            comments: true
          }
        }
      }
    });

    if (!stats) return 0;

    return (
      stats.viewCount * 0.1 +
      stats.likeCount * 0.3 + 
      stats.copyCount * 0.5 +
      stats._count.comments * 0.1
    );
  }`
);

fs.writeFileSync('src/services/BuildService.improved.ts', improvedBuildService);
console.log('✅ УЛУЧШЕННАЯ ВЕРСИЯ СОХРАНЕНА: src/services/BuildService.improved.ts');

console.log('\\n🎯 ДОБАВЛЕННЫЕ ВОЗМОЖНОСТИ:');
console.log('   - getBuildWinRate() - винрейт сборки');
console.log('   - getRecommendedBuilds() - рекомендованные сборки');
console.log('   - getProBuilds() - сборки про-игроков');
console.log('   - calculateBuildSynergy() - синергия предметов');
console.log('   - updateBuildStats() - автоматическое обновление статистики');
console.log('   - Система синергии MLBB предметов');
