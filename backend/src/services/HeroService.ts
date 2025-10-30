import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class HeroService {
  async getAllHeroes(filters: any = {}) {
    return await prisma.hero.findMany({
      where: {},
      include: { abilities: true },
      orderBy: { name: 'asc' }
    });
  }

  async getHeroById(id: string) {
    return await prisma.hero.findUnique({
      where: { id },
      include: { abilities: true }
    });
  }

  async getHeroesByRole(role: string) {
    return await prisma.hero.findMany({
      where: { role: role as any },
      include: { abilities: true }
    });
  }

  async searchHeroes(query: string) {
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

  async getHeroSkills(heroId: string) {
    const hero = await prisma.hero.findUnique({
      where: { id: heroId },
      include: { abilities: true }
    });
    return hero?.abilities || [];
  }

  async getHeroCounters(heroId: string) {
    return await prisma.hero.findMany({ take: 5 });
  }

  async getPopularHeroes(role?: string, limit: number = 10) {
    return await prisma.hero.findMany({
      where: role ? { role: role as any } : {},
      take: limit
    });
  }

  async getMetaTierList() {
    return await prisma.hero.findMany();
  }
}

export const heroService = new HeroService();
