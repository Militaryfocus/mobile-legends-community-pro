"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildService = exports.BuildService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class BuildService {
    // MLBB-специфичные методы для сборок
    async getBuildWinRate(buildId) {
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
        if (!build || !build.playerStats.length)
            return 0;
        const totalWins = build.playerStats.reduce((sum, stat) => sum + stat.wins, 0);
        const totalMatches = build.playerStats.reduce((sum, stat) => sum + stat.matches, 0);
        return totalMatches > 0 ? (totalWins / totalMatches) * 100 : 0;
    }
    async getRecommendedBuilds(heroId, playstyle = 'BALANCED') {
        // Рекомендованные сборки для героя
        return await prisma.build.findMany({
            where: {
                heroId,
                playstyle: playstyle,
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
    async getProBuilds(heroId) {
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
    async calculateBuildSynergy(buildId) {
        // Расчет синергии предметов в сборке
        const build = await prisma.build.findUnique({
            where: { id: buildId },
            include: {
                items: true,
                emblems: true
            }
        });
        if (!build)
            return 0;
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
    async updateBuildStats(buildId) {
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
    hasSynergy(item1, item2) {
        // Логика проверки синергии предметов
        const synergisticPairs = [
            ['Bloodlust Axe', 'War Axe'],
            ['Blade of Despair', 'Windtalker'],
            ['Thunder Belt', 'Brute Force Breastplate'],
            ['Immortality', 'Antique Cuirass']
        ];
        return synergisticPairs.some(pair => (pair[0] === item1.name && pair[1] === item2.name) ||
            (pair[1] === item1.name && pair[0] === item2.name));
    }
    async getBuildPopularity(buildId) {
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
        if (!stats)
            return 0;
        return (stats.viewCount * 0.1 +
            stats.likeCount * 0.3 +
            stats.copyCount * 0.5 +
            stats._count.comments * 0.1);
    }
    async getBuilds(filters = {}) {
        const { heroId, authorId, page = 1, limit = 10 } = filters;
        const skip = (page - 1) * limit;
        const where = {};
        if (heroId) {
            where.heroId = heroId;
        }
        if (authorId) {
            where.authorId = authorId;
        }
        where.isPublic = true;
        const builds = await prisma.build.findMany({
            where,
            include: {
                hero: {
                    select: {
                        id: true,
                        name: true,
                        role: true
                    }
                },
                author: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true
                    }
                },
                spell1: true,
                spell2: true,
                items: {
                    include: {
                        item: true
                    },
                    orderBy: {
                        order: 'asc'
                    }
                },
                emblems: {
                    include: {
                        emblem: true
                    }
                },
                _count: {
                    select: {
                        votes: true,
                        comments: true,
                        likes: true
                    }
                }
            },
            orderBy: {
                popularity: 'desc'
            },
            skip,
            take: limit
        });
        return builds;
    }
    async getBuildById(id) {
        const build = await prisma.build.findUnique({
            where: { id },
            include: {
                hero: true,
                author: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true
                    }
                },
                spell1: true,
                spell2: true,
                items: {
                    include: {
                        item: true
                    },
                    orderBy: {
                        order: 'asc'
                    }
                },
                emblems: {
                    include: {
                        emblem: true
                    }
                },
                votes: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true
                            }
                        }
                    }
                },
                comments: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                username: true,
                                avatar: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
                _count: {
                    select: {
                        votes: true,
                        comments: true,
                        likes: true
                    }
                }
            }
        });
        if (!build) {
            throw new Error('Build not found');
        }
        return build;
    }
    async createBuild(data) {
        const { items, emblems, ...buildData } = data;
        const build = await prisma.build.create({
            data: {
                ...buildData,
                items: {
                    create: items.map((itemId, index) => ({
                        itemId,
                        order: index
                    }))
                },
                emblems: {
                    create: emblems.map(emblemId => ({
                        emblemId
                    }))
                }
            },
            include: {
                hero: true,
                author: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true
                    }
                },
                items: {
                    include: {
                        item: true
                    }
                },
                emblems: {
                    include: {
                        emblem: true
                    }
                }
            }
        });
        return build;
    }
    async updateBuild(id, data, userId) {
        // Проверяем владельца
        const existingBuild = await prisma.build.findUnique({
            where: { id }
        });
        if (!existingBuild) {
            throw new Error('Build not found');
        }
        if (existingBuild.authorId !== userId) {
            throw new Error('Not authorized to update this build');
        }
        const build = await prisma.build.update({
            where: { id },
            data,
            include: {
                hero: true,
                author: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true
                    }
                },
                items: {
                    include: {
                        item: true
                    }
                },
                emblems: {
                    include: {
                        emblem: true
                    }
                }
            }
        });
        return build;
    }
    async deleteBuild(id, userId) {
        // Проверяем владельца
        const existingBuild = await prisma.build.findUnique({
            where: { id }
        });
        if (!existingBuild) {
            throw new Error('Build not found');
        }
        if (existingBuild.authorId !== userId) {
            throw new Error('Not authorized to delete this build');
        }
        await prisma.build.delete({
            where: { id }
        });
    }
    async voteBuild(data) {
        const { buildId, userId, type, value } = data;
        // Проверяем существование сборки
        const build = await prisma.build.findUnique({
            where: { id: buildId }
        });
        if (!build) {
            throw new Error('Build not found');
        }
        // Создаем или обновляем голос
        const vote = await prisma.buildVote.upsert({
            where: {
                buildId_userId: {
                    buildId,
                    userId
                }
            },
            create: {
                buildId,
                userId,
                type,
                value
            },
            update: {
                type,
                value
            }
        });
        // Пересчитываем рейтинг сборки
        await this.calculateBuildRating(buildId);
        return vote;
    }
    async calculateBuildRating(buildId) {
        const votes = await prisma.buildVote.aggregate({
            where: { buildId },
            _avg: {
                value: true
            },
            _count: {
                value: true
            }
        });
        const averageRating = votes._avg.value || 0;
        const voteCount = votes._count.value || 0;
        await prisma.build.update({
            where: { id: buildId },
            data: {
                winRate: averageRating,
                popularity: voteCount
            }
        });
    }
}
exports.BuildService = BuildService;
exports.buildService = new BuildService();
//# sourceMappingURL=BuildService.improved.js.map