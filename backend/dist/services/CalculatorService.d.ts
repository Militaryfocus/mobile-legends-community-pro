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
export declare class CalculatorService {
    calculateBuild(data: BuildCalculation): Promise<CalculationResult>;
    compareBuilds(build1: BuildCalculation, build2: BuildCalculation): Promise<{
        build1: CalculationResult;
        build2: CalculationResult;
        comparison: StatComparison[];
    }>;
    getOptimalBuild(heroId: string, playstyle: string, budget: number): Promise<CalculationResult>;
    private getHeroBaseStats;
    private calculateItemStats;
    private calculateEmblemStats;
    private combineStats;
    private calculateSynergies;
    private generateRecommendations;
    private compareResults;
}
export declare const calculatorService: CalculatorService;
export {};
//# sourceMappingURL=CalculatorService.d.ts.map