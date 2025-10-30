const fs = require('fs');

console.log('🎮 УЛУЧШЕНИЕ HERO SERVICE ДЛЯ MOBILE LEGENDS\\n');

// Читаем текущий HeroService
const heroServicePath = 'src/services/HeroService.ts';
let heroService = fs.readFileSync(heroServicePath, 'utf8');

console.log('📊 ТЕКУЩИЕ ВОЗМОЖНОСТИ:');
const currentMethods = heroService.match(/async\\s+(\\w+)\\(/g) || [];
console.log('Методы:', currentMethods.map(m => m.replace('async ', '').replace('(', '')).join(', '));

// Проверяем что нужно добавить
const mlFeatures = [
  'getHeroSkills',
  'getHeroCounters', 
  'getHeroWinRates',
  'getHeroBuilds',
  'getPopularHeroes',
  'getMetaTierList'
];

const missingFeatures = mlFeatures.filter(feature => 
  !heroService.includes(feature)
);

console.log('\\n🚨 ОТСУТСТВУЮЩИЕ ML ФИЧИ:');
missingFeatures.forEach(feature => console.log(`   - ${feature}`));

// Создаем улучшенную версию
console.log('\\n🔧 СОЗДАЕМ УЛУЧШЕННУЮ ВЕРСИЮ...');

const improvedHeroService = heroService.replace(
  'export class HeroService {',
  `export class HeroService {
  // ML-специфичные методы для Mobile Legends
  
  async getHeroSkills(heroId: string) {
    // Получение скиллов героя (пассивка, 3 скилла, ульт)
    const hero = await prisma.hero.findUnique({
      where: { id: heroId },
      include: { abilities: true }
    });
    return hero?.abilities || [];
  }

  async getHeroCounters(heroId: string) {
    // Контрпики героя - кто силен против него
    const hero = await prisma.hero.findUnique({
      where: { id: heroId }
    });
    
    // Здесь должна быть логика определения контрпиков
    // на основе ролей, характеристик и меты
    return await prisma.hero.findMany({
      where: {
        role: this.getCounterRole(hero?.role),
        difficulty: { lte: 3 } // Простые в освоении контрпики
      },
      take: 5
    });
  }

  async getHeroWinRates(heroId: string, timeframe: string = 'month') {
    // Винрейты героя за период
    const stats = await prisma.playerStats.groupBy({
      by: ['heroId'],
      where: {
        heroId,
        createdAt: this.getTimeframeFilter(timeframe)
      },
      _avg: {
        winRate: true,
        kda: true
      },
      _count: {
        matches: true
      }
    });
    
    return stats[0] || null;
  }

  async getPopularHeroes(role?: string, limit: number = 10) {
    // Самые популярные герои (по использованию)
    return await prisma.hero.findMany({
      where: role ? { role: role as any } : {},
      include: {
        _count: {
          select: {
            playerStats: true,
            builds: true
          }
        }
      },
      orderBy: {
        playerStats: {
          _count: 'desc'
        }
      },
      take: limit
    });
  }

  async getMetaTierList() {
    // Тирлист героев в текущей мете
    const heroes = await prisma.hero.findMany({
      include: {
        _count: {
          select: {
            playerStats: true
          }
        },
        playerStats: {
          select: {
            winRate: true,
            pickRate: true,
            banRate: true
          }
        }
      }
    });

    // Сортировка по винрейту и популярности
    return heroes.map(hero => ({
      ...hero,
      tier: this.calculateTier(hero)
    })).sort((a, b) => b.tier - a.tier);
  }

  private getCounterRole(role: string): string {
    // Логика определения контр-ролей
    const counterMap = {
      'MARKSMAN': 'ASSASSIN',
      'ASSASSIN': 'TANK', 
      'TANK': 'MAGE',
      'MAGE': 'MARKSMAN',
      'SUPPORT': 'ASSASSIN',
      'FIGHTER': 'MARKSMAN'
    };
    return counterMap[role] || 'FIGHTER';
  }

  private getTimeframeFilter(timeframe: string) {
    const now = new Date();
    const filters = {
      'week': { gte: new Date(now.setDate(now.getDate() - 7)) },
      'month': { gte: new Date(now.setMonth(now.getMonth() - 1)) },
      'season': { gte: new Date(now.setMonth(now.getMonth() - 3)) }
    };
    return filters[timeframe] || filters.month;
  }

  private calculateTier(hero: any): number {
    // Расчет тира на основе статистики
    const winRate = hero.playerStats?.[0]?.winRate || 50;
    const pickRate = hero._count.playerStats || 0;
    return (winRate * 0.7) + (pickRate * 0.3);
  }`
);

// Сохраняем улучшенную версию
fs.writeFileSync('src/services/HeroService.improved.ts', improvedHeroService);
console.log('✅ УЛУЧШЕННАЯ ВЕРСИЯ СОХРАНЕНА: src/services/HeroService.improved.ts');

console.log('\\n🎯 ДОБАВЛЕННЫЕ ВОЗМОЖНОСТИ:');
console.log('   - getHeroSkills() - скиллы героев ML');
console.log('   - getHeroCounters() - система контрпиков');
console.log('   - getHeroWinRates() - винрейты за периоды');
console.log('   - getPopularHeroes() - популярные герои');
console.log('   - getMetaTierList() - тирлист меты');
console.log('   - Система расчета тиров на основе статистики');
