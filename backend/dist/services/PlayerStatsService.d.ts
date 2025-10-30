export declare class PlayerStatsService {
    getPlayerStats(userId: string): Promise<({
        user: {
            email: string;
            username: string;
            gameNickname: string | null;
            id: string;
            passwordHash: string | null;
            role: import(".prisma/client").$Enums.UserRole;
            avatar: string | null;
            isVerified: boolean;
            gameAccountVerified: boolean;
            gameServer: string | null;
            gameId: string | null;
            mainRole: string | null;
            rankTier: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        hero: {
            id: string;
            role: import(".prisma/client").$Enums.HeroRole;
            name: string;
            description: string | null;
            title: string;
            difficulty: number | null;
        };
    } & {
        id: string;
        updatedAt: Date;
        userId: string;
        heroId: string;
        matches: number;
        wins: number;
        kills: number;
        deaths: number;
        assists: number;
    })[]>;
    getHeroStats(userId: string, heroId: string): Promise<({
        user: {
            email: string;
            username: string;
            gameNickname: string | null;
            id: string;
            passwordHash: string | null;
            role: import(".prisma/client").$Enums.UserRole;
            avatar: string | null;
            isVerified: boolean;
            gameAccountVerified: boolean;
            gameServer: string | null;
            gameId: string | null;
            mainRole: string | null;
            rankTier: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        hero: {
            id: string;
            role: import(".prisma/client").$Enums.HeroRole;
            name: string;
            description: string | null;
            title: string;
            difficulty: number | null;
        };
    } & {
        id: string;
        updatedAt: Date;
        userId: string;
        heroId: string;
        matches: number;
        wins: number;
        kills: number;
        deaths: number;
        assists: number;
    })[]>;
    getRankProgress(userId: string): Promise<{
        currentRank: string | null;
        stars: number;
        matchesPlayed: number;
        winRate: number;
        totalWins: number;
    }>;
    updatePlayerStats(userId: string, heroId: string, result: string, kills: number, deaths: number, assists: number): Promise<{
        id: string;
        updatedAt: Date;
        userId: string;
        heroId: string;
        matches: number;
        wins: number;
        kills: number;
        deaths: number;
        assists: number;
    }>;
    getPlayerComparison(userId: string, heroId: string): Promise<{
        userStats: {
            id: string;
            updatedAt: Date;
            userId: string;
            heroId: string;
            matches: number;
            wins: number;
            kills: number;
            deaths: number;
            assists: number;
        } | null;
        globalStats: {
            avgKills: number;
            avgDeaths: number;
            avgAssists: number;
            totalMatches: number;
        };
    }>;
    getLeaderboard(type?: string, limit?: number): Promise<({
        user: {
            email: string;
            username: string;
            gameNickname: string | null;
            id: string;
            passwordHash: string | null;
            role: import(".prisma/client").$Enums.UserRole;
            avatar: string | null;
            isVerified: boolean;
            gameAccountVerified: boolean;
            gameServer: string | null;
            gameId: string | null;
            mainRole: string | null;
            rankTier: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        hero: {
            id: string;
            role: import(".prisma/client").$Enums.HeroRole;
            name: string;
            description: string | null;
            title: string;
            difficulty: number | null;
        };
    } & {
        id: string;
        updatedAt: Date;
        userId: string;
        heroId: string;
        matches: number;
        wins: number;
        kills: number;
        deaths: number;
        assists: number;
    })[]>;
}
export declare const playerStatsService: PlayerStatsService;
//# sourceMappingURL=PlayerStatsService.d.ts.map