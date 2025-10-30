"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.heroService = exports.HeroService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class HeroService {
    async getAllHeroes(filters = {}) {
        return await prisma.hero.findMany({
            where: {},
            include: { abilities: true },
            orderBy: { name: 'asc' }
        });
    }
    async getHeroById(id) {
        return await prisma.hero.findUnique({
            where: { id },
            include: { abilities: true }
        });
    }
    async getHeroesByRole(role) {
        return await prisma.hero.findMany({
            where: { role: role },
            include: { abilities: true }
        });
    }
    async searchHeroes(query) {
        return await prisma.hero.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { title: { contains: query, mode: 'insensitive' } }
                ]
            },
            take: 10
        });
    }
    async getHeroMetaStats() {
        return await prisma.hero.findMany({
            include: { abilities: true }
        });
    }
    async getHeroSkills(heroId) {
        const hero = await prisma.hero.findUnique({
            where: { id: heroId },
            include: { abilities: true }
        });
        return hero?.abilities || [];
    }
    async getHeroCounters(heroId) {
        return await prisma.hero.findMany({ take: 5 });
    }
    async getPopularHeroes(role, limit = 10) {
        return await prisma.hero.findMany({
            where: role ? { role: role } : {},
            take: limit
        });
    }
    async getMetaTierList() {
        return await prisma.hero.findMany();
    }
}
exports.HeroService = HeroService;
exports.heroService = new HeroService();
//# sourceMappingURL=HeroService.js.map