import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface BuildCalculation {
  items: string[];
  emblems: string[];
  heroId: string;
  level: number;
  spell1?: string;
  spell2?: string;
}

export interface HeroStats {
  physicalAttack: number;
  magicPower: number;
  armor: number;
  magicResistance: number;
  hp: number;
  mana: number;
  movementSpeed: number;
  attackSpeed: number;
  cooldownReduction: number;
  lifesteal: number;
  physicalPenetration: number;
  magicPenetration: number;
  criticalChance: number;
}

export interface CalculationResult {
  totalCost: number;
  stats: HeroStats;
  synergies: Synergy[];
  recommendations: string[];
}

export interface Synergy {
  name: string;
  description: string;
  bonus: string;
  score: number;
}

interface StatComparison {
  stat: string;
  build1: number;
  build2: number;
  difference: number;
  advantage: string;
}

export class CalculatorService {
  async calculateBuild(data: BuildCalculation): Promise<CalculationResult> {
    const [items, emblems, hero] = await Promise.all([
      prisma.item.findMany({ where: { id: { in: data.items } } }),
      prisma.emblem.findMany({ where: { id: { in: data.emblems } } }),
      prisma.hero.findUnique({ where: { id: data.heroId } })
    ]);

    if (!hero) {
      throw new Error('Hero not found');
    }

    // Базовые статы героя
    const baseStats = this.getHeroBaseStats(hero, data.level);
    
    // Расчет статов от предметов
    const itemStats = this.calculateItemStats(items);
    
    // Расчет статов от эмблем
    const emblemStats = this.calculateEmblemStats(emblems);
    
    // Итоговые статы
    const totalStats = this.combineStats([baseStats, itemStats, emblemStats]);
    
    // Расчет синергий
    const synergies = this.calculateSynergies(items);
    
    // Рекомендации
    const recommendations = this.generateRecommendations(totalStats, synergies, hero);

    return {
      totalCost: items.reduce((sum, item) => sum + (item.price || 0), 0), // Используем price вместо cost
      stats: totalStats,
      synergies,
      recommendations
    };
  }

  async compareBuilds(build1: BuildCalculation, build2: BuildCalculation) {
    const [result1, result2] = await Promise.all([
      this.calculateBuild(build1),
      this.calculateBuild(build2)
    ]);

    return {
      build1: result1,
      build2: result2,
      comparison: this.compareResults(result1, result2)
    };
  }

  async getOptimalBuild(heroId: string, playstyle: string, budget: number) {
    // Находим оптимальные предметы по стилю игры и бюджету
    const items = await prisma.item.findMany({
      where: {
        price: { lte: budget } // Используем price вместо cost
      },
      take: 6
    });

    return this.calculateBuild({
      heroId,
      items: items.map(item => item.id),
      emblems: [],
      level: 15
    });
  }

  private getHeroBaseStats(hero: any, level: number): HeroStats {
    // Упрощенные базовые статы героев MLBB
    const baseStats: HeroStats = {
      physicalAttack: 100 + (level * 8),
      magicPower: 0,
      armor: 15 + (level * 3),
      magicResistance: 10 + (level * 2),
      hp: 2500 + (level * 150),
      mana: 500 + (level * 30),
      movementSpeed: 260,
      attackSpeed: 1.0,
      cooldownReduction: 0,
      lifesteal: 0,
      physicalPenetration: 0,
      magicPenetration: 0,
      criticalChance: 0
    };

    // Корректировка по роли героя
    switch (hero.role) {
      case 'MARKSMAN':
        baseStats.physicalAttack += 20;
        baseStats.attackSpeed += 0.2;
        break;
      case 'MAGE':
        baseStats.magicPower += 50;
        baseStats.mana += 200;
        break;
      case 'TANK':
        baseStats.hp += 500;
        baseStats.armor += 10;
        baseStats.magicResistance += 10;
        break;
      case 'ASSASSIN':
        baseStats.physicalAttack += 15;
        baseStats.movementSpeed += 10;
        break;
      case 'FIGHTER':
        baseStats.physicalAttack += 10;
        baseStats.hp += 300;
        break;
      case 'SUPPORT':
        baseStats.magicPower += 30;
        baseStats.hp += 200;
        break;
    }

    return baseStats;
  }

  private calculateItemStats(items: any[]): HeroStats {
    const stats: HeroStats = {
      physicalAttack: 0,
      magicPower: 0,
      armor: 0,
      magicResistance: 0,
      hp: 0,
      mana: 0,
      movementSpeed: 0,
      attackSpeed: 0,
      cooldownReduction: 0,
      lifesteal: 0,
      physicalPenetration: 0,
      magicPenetration: 0,
      criticalChance: 0
    };

    items.forEach(item => {
      // Извлекаем статы из JSON поля stats
      const itemStats = item.stats as any;
      if (itemStats) {
        stats.physicalAttack += itemStats.physicalAttack || 0;
        stats.magicPower += itemStats.magicPower || 0;
        stats.armor += itemStats.armor || 0;
        stats.magicResistance += itemStats.magicResistance || 0;
        stats.hp += itemStats.hp || 0;
        stats.mana += itemStats.mana || 0;
        stats.movementSpeed += itemStats.movementSpeed || 0;
        stats.attackSpeed += itemStats.attackSpeed || 0;
        stats.cooldownReduction += itemStats.cooldownReduction || 0;
        stats.lifesteal += itemStats.lifesteal || 0;
        stats.physicalPenetration += itemStats.physicalPenetration || 0;
        stats.magicPenetration += itemStats.magicPenetration || 0;
        stats.criticalChance += itemStats.criticalChance || 0;
      }
    });

    // Ограничения
    stats.cooldownReduction = Math.min(stats.cooldownReduction, 40);
    stats.criticalChance = Math.min(stats.criticalChance, 100);

    return stats;
  }

  private calculateEmblemStats(emblems: any[]): HeroStats {
    const stats: HeroStats = {
      physicalAttack: 0,
      magicPower: 0,
      armor: 0,
      magicResistance: 0,
      hp: 0,
      mana: 0,
      movementSpeed: 0,
      attackSpeed: 0,
      cooldownReduction: 0,
      lifesteal: 0,
      physicalPenetration: 0,
      magicPenetration: 0,
      criticalChance: 0
    };

    emblems.forEach(emblem => {
      const emblemStats = emblem.stats as any;
      if (emblemStats) {
        stats.physicalAttack += emblemStats.physicalAttack || 5;
        stats.magicPower += emblemStats.magicPower || 5;
        stats.hp += emblemStats.hp || 100;
      }
    });

    return stats;
  }

  private combineStats(statsArray: HeroStats[]): HeroStats {
    const result: HeroStats = { ...statsArray[0] };
    
    for (let i = 1; i < statsArray.length; i++) {
      const stats = statsArray[i];
      result.physicalAttack += stats.physicalAttack;
      result.magicPower += stats.magicPower;
      result.armor += stats.armor;
      result.magicResistance += stats.magicResistance;
      result.hp += stats.hp;
      result.mana += stats.mana;
      result.movementSpeed += stats.movementSpeed;
      result.attackSpeed += stats.attackSpeed;
      result.cooldownReduction += stats.cooldownReduction;
      result.lifesteal += stats.lifesteal;
      result.physicalPenetration += stats.physicalPenetration;
      result.magicPenetration += stats.magicPenetration;
      result.criticalChance += stats.criticalChance;
    }

    return result;
  }

  private calculateSynergies(items: any[]): Synergy[] {
    const synergies: Synergy[] = [];
    const itemNames = items.map(item => item.name);

    // Проверка синергий по названиям предметов
    if (itemNames.includes('Blade of Despair') && itemNames.includes('Berserker\'s Fury')) {
      synergies.push({
        name: 'Критический удар',
        description: 'Комбинация для максимального крита',
        bonus: '+15% шанс крита, +20% урон крита',
        score: 8
      });
    }

    if (itemNames.includes('Bloodlust Axe') && itemNames.includes('Queen\'s Wings')) {
      synergies.push({
        name: 'Вампиризм',
        description: 'Комбинация для выживания в бою',
        bonus: '+10% вампиризм, +15% снижение урона при низком HP',
        score: 7
      });
    }

    // Универсальные синергии по типам предметов
    const physicalItems = items.filter(item => item.type === 'ATTACK').length;
    const defenseItems = items.filter(item => item.type === 'DEFENSE').length;
    const magicItems = items.filter(item => item.type === 'MAGIC').length;

    if (physicalItems >= 3) {
      synergies.push({
        name: 'Атакующий набор',
        description: 'Множество атакующих предметов',
        bonus: '+20 физической атаки, +10% скорость атаки',
        score: 7
      });
    }

    if (defenseItems >= 3) {
      synergies.push({
        name: 'Защитный набор',
        description: 'Множество защитных предметов',
        bonus: '+30 брони, +25 магического сопротивления',
        score: 6
      });
    }

    if (magicItems >= 3) {
      synergies.push({
        name: 'Магический набор',
        description: 'Множество магических предметов',
        bonus: '+40 магической силы, +10% CDR',
        score: 7
      });
    }

    return synergies;
  }

  private generateRecommendations(stats: HeroStats, synergies: Synergy[], hero: any): string[] {
    const recommendations: string[] = [];
    const role = hero.role;

    // Рекомендации по статам
    if (role === 'MARKSMAN' && stats.physicalAttack < 300) {
      recommendations.push('Добавьте больше предметов с физической атакой');
    }

    if (role === 'MAGE' && stats.magicPower < 400) {
      recommendations.push('Увеличьте магическую силу');
    }

    if (stats.hp < 4000 && role !== 'ASSASSIN') {
      recommendations.push('Рассмотрите предметы с HP для выживаемости');
    }

    if (stats.cooldownReduction < 20 && (role === 'MAGE' || role === 'SUPPORT')) {
      recommendations.push('Добавьте CDR для более частого использования способностей');
    }

    // Рекомендации по синергиям
    if (synergies.length === 0) {
      recommendations.push('Попробуйте комбинировать предметы для получения синергий');
    }

    return recommendations;
  }

  private compareResults(result1: CalculationResult, result2: CalculationResult): StatComparison[] {
    const comparisons: StatComparison[] = [];
    
    const stats1 = result1.stats;
    const stats2 = result2.stats;

    // Сравнение ключевых статов
    const keyStats: (keyof HeroStats)[] = ['physicalAttack', 'magicPower', 'hp', 'armor', 'magicResistance'];
    
    keyStats.forEach(stat => {
      const diff = stats1[stat] - stats2[stat];
      if (Math.abs(diff) > 10) {
        comparisons.push({
          stat,
          build1: stats1[stat],
          build2: stats2[stat],
          difference: diff,
          advantage: diff > 0 ? 'build1' : 'build2'
        });
      }
    });

    return comparisons;
  }
}

export const calculatorService = new CalculatorService();
