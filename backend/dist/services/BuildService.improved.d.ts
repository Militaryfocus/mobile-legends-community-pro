import { Playstyle, VoteType } from '@prisma/client';
export interface CreateBuildData {
    name: string;
    description?: string;
    heroId: string;
    playstyle: Playstyle;
    spell1Id?: string;
    spell2Id?: string;
    items: string[];
    emblems: string[];
    isPublic?: boolean;
}
export interface VoteBuildData {
    buildId: string;
    userId: string;
    type: VoteType;
    value: number;
}
export interface GetBuildsFilters {
    heroId?: string;
    authorId?: string;
    page?: number;
    limit?: number;
}
export declare class BuildService {
    getBuildWinRate(buildId: string): Promise<number>;
    getRecommendedBuilds(heroId: string, playstyle?: string): Promise<({
        _count: {
            comments: number;
            likes: number;
            votes: number;
        };
        author: {
            username: string;
            id: string;
            avatar: string | null;
        };
        hero: {
            id: string;
            role: import(".prisma/client").$Enums.HeroRole;
            name: string;
            description: string | null;
            title: string;
            difficulty: number | null;
        };
        items: {
            id: string;
            buildId: string;
            itemId: string;
            order: number;
        }[];
        emblems: {
            id: string;
            buildId: string;
            emblemId: string;
            setup: import("@prisma/client/runtime/library").JsonValue | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        viewCount: number;
        likeCount: number;
        authorId: string;
        heroId: string;
        winRate: number | null;
        isPublic: boolean;
        isFeatured: boolean;
        popularity: number | null;
        playstyle: import(".prisma/client").$Enums.Playstyle;
        spell1Id: string | null;
        spell2Id: string | null;
        copyCount: number;
    })[]>;
    getProBuilds(heroId: string): Promise<({
        author: {
            username: string;
            id: string;
            avatar: string | null;
            rankTier: string | null;
        };
        items: {
            id: string;
            buildId: string;
            itemId: string;
            order: number;
        }[];
        emblems: {
            id: string;
            buildId: string;
            emblemId: string;
            setup: import("@prisma/client/runtime/library").JsonValue | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        viewCount: number;
        likeCount: number;
        authorId: string;
        heroId: string;
        winRate: number | null;
        isPublic: boolean;
        isFeatured: boolean;
        popularity: number | null;
        playstyle: import(".prisma/client").$Enums.Playstyle;
        spell1Id: string | null;
        spell2Id: string | null;
        copyCount: number;
    })[]>;
    calculateBuildSynergy(buildId: string): Promise<number>;
    updateBuildStats(buildId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        viewCount: number;
        likeCount: number;
        authorId: string;
        heroId: string;
        winRate: number | null;
        isPublic: boolean;
        isFeatured: boolean;
        popularity: number | null;
        playstyle: import(".prisma/client").$Enums.Playstyle;
        spell1Id: string | null;
        spell2Id: string | null;
        copyCount: number;
    }>;
    private hasSynergy;
    private getBuildPopularity;
    getBuilds(filters?: GetBuildsFilters): Promise<({
        _count: {
            comments: number;
            likes: number;
            votes: number;
        };
        author: {
            username: string;
            id: string;
            avatar: string | null;
        };
        hero: {
            id: string;
            role: import(".prisma/client").$Enums.HeroRole;
            name: string;
        };
        spell1: {
            id: string;
            name: string;
            description: string | null;
            cooldown: number | null;
            iconUrl: string | null;
        } | null;
        spell2: {
            id: string;
            name: string;
            description: string | null;
            cooldown: number | null;
            iconUrl: string | null;
        } | null;
        items: ({
            item: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                type: import(".prisma/client").$Enums.ItemType;
                iconUrl: string | null;
                price: number | null;
                stats: import("@prisma/client/runtime/library").JsonValue | null;
                tier: import(".prisma/client").$Enums.ItemTier;
            };
        } & {
            id: string;
            buildId: string;
            itemId: string;
            order: number;
        })[];
        emblems: ({
            emblem: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                type: import(".prisma/client").$Enums.EmblemType;
                iconUrl: string | null;
            };
        } & {
            id: string;
            buildId: string;
            emblemId: string;
            setup: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        viewCount: number;
        likeCount: number;
        authorId: string;
        heroId: string;
        winRate: number | null;
        isPublic: boolean;
        isFeatured: boolean;
        popularity: number | null;
        playstyle: import(".prisma/client").$Enums.Playstyle;
        spell1Id: string | null;
        spell2Id: string | null;
        copyCount: number;
    })[]>;
    getBuildById(id: string): Promise<{
        _count: {
            comments: number;
            likes: number;
            votes: number;
        };
        author: {
            username: string;
            id: string;
            avatar: string | null;
        };
        hero: {
            id: string;
            role: import(".prisma/client").$Enums.HeroRole;
            name: string;
            description: string | null;
            title: string;
            difficulty: number | null;
        };
        comments: ({
            author: {
                username: string;
                id: string;
                avatar: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            authorId: string;
            buildId: string;
            parentId: string | null;
        })[];
        spell1: {
            id: string;
            name: string;
            description: string | null;
            cooldown: number | null;
            iconUrl: string | null;
        } | null;
        spell2: {
            id: string;
            name: string;
            description: string | null;
            cooldown: number | null;
            iconUrl: string | null;
        } | null;
        items: ({
            item: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                type: import(".prisma/client").$Enums.ItemType;
                iconUrl: string | null;
                price: number | null;
                stats: import("@prisma/client/runtime/library").JsonValue | null;
                tier: import(".prisma/client").$Enums.ItemTier;
            };
        } & {
            id: string;
            buildId: string;
            itemId: string;
            order: number;
        })[];
        emblems: ({
            emblem: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                type: import(".prisma/client").$Enums.EmblemType;
                iconUrl: string | null;
            };
        } & {
            id: string;
            buildId: string;
            emblemId: string;
            setup: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
        votes: ({
            user: {
                username: string;
                id: string;
            };
        } & {
            id: string;
            userId: string;
            type: import(".prisma/client").$Enums.VoteType;
            buildId: string;
            value: number;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        viewCount: number;
        likeCount: number;
        authorId: string;
        heroId: string;
        winRate: number | null;
        isPublic: boolean;
        isFeatured: boolean;
        popularity: number | null;
        playstyle: import(".prisma/client").$Enums.Playstyle;
        spell1Id: string | null;
        spell2Id: string | null;
        copyCount: number;
    }>;
    createBuild(data: CreateBuildData & {
        authorId: string;
    }): Promise<{
        author: {
            username: string;
            id: string;
            avatar: string | null;
        };
        hero: {
            id: string;
            role: import(".prisma/client").$Enums.HeroRole;
            name: string;
            description: string | null;
            title: string;
            difficulty: number | null;
        };
        items: ({
            item: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                type: import(".prisma/client").$Enums.ItemType;
                iconUrl: string | null;
                price: number | null;
                stats: import("@prisma/client/runtime/library").JsonValue | null;
                tier: import(".prisma/client").$Enums.ItemTier;
            };
        } & {
            id: string;
            buildId: string;
            itemId: string;
            order: number;
        })[];
        emblems: ({
            emblem: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                type: import(".prisma/client").$Enums.EmblemType;
                iconUrl: string | null;
            };
        } & {
            id: string;
            buildId: string;
            emblemId: string;
            setup: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        viewCount: number;
        likeCount: number;
        authorId: string;
        heroId: string;
        winRate: number | null;
        isPublic: boolean;
        isFeatured: boolean;
        popularity: number | null;
        playstyle: import(".prisma/client").$Enums.Playstyle;
        spell1Id: string | null;
        spell2Id: string | null;
        copyCount: number;
    }>;
    updateBuild(id: string, data: any, userId: string): Promise<{
        author: {
            username: string;
            id: string;
            avatar: string | null;
        };
        hero: {
            id: string;
            role: import(".prisma/client").$Enums.HeroRole;
            name: string;
            description: string | null;
            title: string;
            difficulty: number | null;
        };
        items: ({
            item: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                type: import(".prisma/client").$Enums.ItemType;
                iconUrl: string | null;
                price: number | null;
                stats: import("@prisma/client/runtime/library").JsonValue | null;
                tier: import(".prisma/client").$Enums.ItemTier;
            };
        } & {
            id: string;
            buildId: string;
            itemId: string;
            order: number;
        })[];
        emblems: ({
            emblem: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                type: import(".prisma/client").$Enums.EmblemType;
                iconUrl: string | null;
            };
        } & {
            id: string;
            buildId: string;
            emblemId: string;
            setup: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        viewCount: number;
        likeCount: number;
        authorId: string;
        heroId: string;
        winRate: number | null;
        isPublic: boolean;
        isFeatured: boolean;
        popularity: number | null;
        playstyle: import(".prisma/client").$Enums.Playstyle;
        spell1Id: string | null;
        spell2Id: string | null;
        copyCount: number;
    }>;
    deleteBuild(id: string, userId: string): Promise<void>;
    voteBuild(data: VoteBuildData): Promise<{
        id: string;
        userId: string;
        type: import(".prisma/client").$Enums.VoteType;
        buildId: string;
        value: number;
    }>;
    private calculateBuildRating;
}
export declare const buildService: BuildService;
//# sourceMappingURL=BuildService.improved.d.ts.map