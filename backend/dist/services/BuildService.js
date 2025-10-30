"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildService = exports.BuildService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class BuildService {
    async getBuilds(filters = {}) {
        const where = {};
        if (filters.heroId)
            where.heroId = filters.heroId;
        if (filters.authorId)
            where.authorId = filters.authorId;
        if (filters.isPublic !== undefined)
            where.isPublic = filters.isPublic;
        const builds = await prisma.build.findMany({
            where,
            include: {
                author: { select: { id: true, username: true, avatar: true } },
                hero: true,
                items: true,
                emblems: true
            },
            orderBy: { createdAt: 'desc' }
        });
        return {
            data: builds,
            pagination: { page: 1, limit: 10, total: builds.length, pages: Math.ceil(builds.length / 10) }
        };
    }
    async getBuildById(id) {
        return await prisma.build.findUnique({
            where: { id },
            include: {
                author: { select: { id: true, username: true, avatar: true } },
                hero: true,
                items: true,
                emblems: true
            }
        });
    }
    async createBuild(data) {
        return await prisma.build.create({
            data: {
                name: data.name,
                description: data.description,
                heroId: data.heroId,
                authorId: data.authorId,
                playstyle: data.playstyle || 'BALANCED',
                isPublic: data.isPublic !== undefined ? data.isPublic : true
            }
        });
    }
    async updateBuild(id, data, userId) {
        return await prisma.build.update({
            where: { id },
            data: { ...data, updatedAt: new Date() }
        });
    }
    async deleteBuild(id, userId) {
        return await prisma.build.delete({ where: { id } });
    }
    async voteBuild(data) {
        return { upvotes: 0, downvotes: 0, rating: 0 };
    }
    async getRecommendedBuilds(heroId, playstyle = 'BALANCED') {
        return await prisma.build.findMany({
            where: { heroId, isPublic: true },
            take: 10
        });
    }
    async getProBuilds(heroId) {
        return await prisma.build.findMany({
            where: { heroId, isPublic: true },
            take: 5
        });
    }
}
exports.BuildService = BuildService;
exports.buildService = new BuildService();
//# sourceMappingURL=BuildService.js.map