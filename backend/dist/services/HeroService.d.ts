export declare class HeroService {
    getAllHeroes(filters?: any): Promise<({
        abilities: {
            id: string;
            name: string;
            description: string | null;
            heroId: string;
        }[];
    } & {
        id: string;
        role: import(".prisma/client").$Enums.HeroRole;
        name: string;
        description: string | null;
        title: string;
        difficulty: number | null;
    })[]>;
    getHeroById(id: string): Promise<({
        abilities: {
            id: string;
            name: string;
            description: string | null;
            heroId: string;
        }[];
    } & {
        id: string;
        role: import(".prisma/client").$Enums.HeroRole;
        name: string;
        description: string | null;
        title: string;
        difficulty: number | null;
    }) | null>;
    getHeroesByRole(role: string): Promise<({
        abilities: {
            id: string;
            name: string;
            description: string | null;
            heroId: string;
        }[];
    } & {
        id: string;
        role: import(".prisma/client").$Enums.HeroRole;
        name: string;
        description: string | null;
        title: string;
        difficulty: number | null;
    })[]>;
    searchHeroes(query: string): Promise<{
        id: string;
        role: import(".prisma/client").$Enums.HeroRole;
        name: string;
        description: string | null;
        title: string;
        difficulty: number | null;
    }[]>;
    getHeroMetaStats(): Promise<({
        abilities: {
            id: string;
            name: string;
            description: string | null;
            heroId: string;
        }[];
    } & {
        id: string;
        role: import(".prisma/client").$Enums.HeroRole;
        name: string;
        description: string | null;
        title: string;
        difficulty: number | null;
    })[]>;
    getHeroSkills(heroId: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        heroId: string;
    }[]>;
    getHeroCounters(heroId: string): Promise<{
        id: string;
        role: import(".prisma/client").$Enums.HeroRole;
        name: string;
        description: string | null;
        title: string;
        difficulty: number | null;
    }[]>;
    getPopularHeroes(role?: string, limit?: number): Promise<{
        id: string;
        role: import(".prisma/client").$Enums.HeroRole;
        name: string;
        description: string | null;
        title: string;
        difficulty: number | null;
    }[]>;
    getMetaTierList(): Promise<{
        id: string;
        role: import(".prisma/client").$Enums.HeroRole;
        name: string;
        description: string | null;
        title: string;
        difficulty: number | null;
    }[]>;
}
export declare const heroService: HeroService;
//# sourceMappingURL=HeroService.d.ts.map