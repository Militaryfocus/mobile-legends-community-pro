import { AuthenticatedRequest } from "../middleware/auth";
import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { PrismaClient, TeamRole } from '@prisma/client';

const prisma = new PrismaClient();

export class TeamController {
  async getAllTeams(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 20, search } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const where: any = {};
      if (search) {
        where.OR = [
          { name: { contains: search as string, mode: 'insensitive' } },
          { description: { contains: search as string, mode: 'insensitive' } }
        ];
      }

      const [teams, total] = await Promise.all([
        prisma.team.findMany({
          where,
          include: {
            leader: {
              select: {
                id: true,
                username: true,
                avatar: true,
                gameNickname: true
              }
            },
            members: {
              include: {
                user: {
                  select: {
                    id: true,
                    username: true,
                    avatar: true,
                    gameNickname: true,
                    mainRole: true
                  }
                }
              }
            },
            _count: {
              select: {
                members: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: Number(limit)
        }),
        prisma.team.count({ where })
      ]);

      res.json({
        success: true,
        data: teams,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error: any) {
      next(error);
    }
  }

  async createTeam(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Not authenticated' });
      }

      const { name, description } = req.body;

      const team = await prisma.team.create({
        data: {
          name,
          description,
          leaderId: req.user.userId,
          members: {
            create: {
              userId: req.user.userId,
              role: TeamRole.CAPTAIN
            }
          }
        },
        include: {
          leader: {
            select: {
              id: true,
              username: true,
              avatar: true
            }
          },
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  avatar: true,
                  mainRole: true
                }
              }
            }
          }
        }
      });

      res.status(201).json({
        success: true,
        data: team
      });
    } catch (error: any) {
      next(error);
    }
  }

  async getTeamById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const team = await prisma.team.findUnique({
        where: { id },
        include: {
          leader: {
            select: {
              id: true,
              username: true,
              avatar: true,
              gameNickname: true
            }
          },
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  avatar: true,
                  gameNickname: true,
                  mainRole: true,
                  rankTier: true
                }
              }
            },
            orderBy: { role: 'desc' }
          }
        }
      });

      if (!team) {
        return res.status(404).json({
          success: false,
          error: 'Team not found'
        });
      }

      res.json({
        success: true,
        data: team
      });
    } catch (error: any) {
      next(error);
    }
  }

  async joinTeam(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Not authenticated' });
      }

      const { id } = req.params;

      const teamMember = await prisma.teamMember.create({
        data: {
          teamId: id,
          userId: req.user.userId,
          role: TeamRole.MEMBER
        },
        include: {
          team: true,
          user: {
            select: {
              id: true,
              username: true,
              avatar: true,
              mainRole: true
            }
          }
        }
      });

      res.status(201).json({
        success: true,
        data: teamMember
      });
    } catch (error: any) {
      next(error);
    }
  }
}

export const teamController = new TeamController();
