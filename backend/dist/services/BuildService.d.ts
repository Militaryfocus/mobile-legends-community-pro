export declare class BuildService {
    getBuilds(filters?: any): Promise<{
        data: ({
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
            isPublic: boolean;
            isFeatured: boolean;
            winRate: number | null;
            popularity: number | null;
            playstyle: import(".prisma/client").$Enums.Playstyle;
            spell1Id: string | null;
            spell2Id: string | null;
            copyCount: number;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    getBuildById(id: string): Promise<({
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
        isPublic: boolean;
        isFeatured: boolean;
        winRate: number | null;
        popularity: number | null;
        playstyle: import(".prisma/client").$Enums.Playstyle;
        spell1Id: string | null;
        spell2Id: string | null;
        copyCount: number;
    }) | null>;
    createBuild(data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        viewCount: number;
        likeCount: number;
        authorId: string;
        heroId: string;
        isPublic: boolean;
        isFeatured: boolean;
        winRate: number | null;
        popularity: number | null;
        playstyle: import(".prisma/client").$Enums.Playstyle;
        spell1Id: string | null;
        spell2Id: string | null;
        copyCount: number;
    }>;
    updateBuild(id: string, data: any, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        viewCount: number;
        likeCount: number;
        authorId: string;
        heroId: string;
        isPublic: boolean;
        isFeatured: boolean;
        winRate: number | null;
        popularity: number | null;
        playstyle: import(".prisma/client").$Enums.Playstyle;
        spell1Id: string | null;
        spell2Id: string | null;
        copyCount: number;
    }>;
    deleteBuild(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        viewCount: number;
        likeCount: number;
        authorId: string;
        heroId: string;
        isPublic: boolean;
        isFeatured: boolean;
        winRate: number | null;
        popularity: number | null;
        playstyle: import(".prisma/client").$Enums.Playstyle;
        spell1Id: string | null;
        spell2Id: string | null;
        copyCount: number;
    }>;
    voteBuild(data: any): Promise<{
        upvotes: number;
        downvotes: number;
        rating: number;
    }>;
    getRecommendedBuilds(heroId: string, playstyle?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        viewCount: number;
        likeCount: number;
        authorId: string;
        heroId: string;
        isPublic: boolean;
        isFeatured: boolean;
        winRate: number | null;
        popularity: number | null;
        playstyle: import(".prisma/client").$Enums.Playstyle;
        spell1Id: string | null;
        spell2Id: string | null;
        copyCount: number;
    }[]>;
    getProBuilds(heroId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        viewCount: number;
        likeCount: number;
        authorId: string;
        heroId: string;
        isPublic: boolean;
        isFeatured: boolean;
        winRate: number | null;
        popularity: number | null;
        playstyle: import(".prisma/client").$Enums.Playstyle;
        spell1Id: string | null;
        spell2Id: string | null;
        copyCount: number;
    }[]>;
}
export declare const buildService: BuildService;
//# sourceMappingURL=BuildService.d.ts.map