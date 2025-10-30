import { Prisma } from '@prisma/client';
export type HeroWithRelations = Prisma.HeroGetPayload<{
    include: {
        abilities: true;
        _count: {
            select: {
                playerStats: true;
                builds: true;
            };
        };
    };
}>;
export type BuildWithRelations = Prisma.BuildGetPayload<{
    include: {
        author: true;
        hero: true;
        items: true;
        emblems: true;
        _count: {
            select: {
                votes: true;
                comments: true;
                likes: true;
            };
        };
    };
}>;
export type PlayerStatsWithRelations = Prisma.PlayerStatsGetPayload<{
    include: {
        user: true;
        hero: true;
    };
}>;
//# sourceMappingURL=prisma.d.ts.map