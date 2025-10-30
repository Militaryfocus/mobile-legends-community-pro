import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class BuildService {
  async getBuilds(filters: any = {}) {
    const where: any = {};
    if (filters.heroId) where.heroId = filters.heroId;
    if (filters.authorId) where.authorId = filters.authorId;
    if (filters.isPublic !== undefined) where.isPublic = filters.isPublic;

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

  async getBuildById(id: string) {
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

  async createBuild(data: any) {
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

  async updateBuild(id: string, data: any, userId: string) {
    return await prisma.build.update({
      where: { id },
      data: { ...data, updatedAt: new Date() }
    });
  }

  async deleteBuild(id: string, userId: string) {
    return await prisma.build.delete({ where: { id } });
  }

  async voteBuild(data: any) {
    return { upvotes: 0, downvotes: 0, rating: 0 };
  }

  async getRecommendedBuilds(heroId: string, playstyle: string = 'BALANCED') {
    return await prisma.build.findMany({
      where: { heroId, isPublic: true },
      take: 10
    });
  }

  async getProBuilds(heroId: string) {
    return await prisma.build.findMany({
      where: { heroId, isPublic: true },
      take: 5
    });
  }
}

export const buildService = new BuildService();
