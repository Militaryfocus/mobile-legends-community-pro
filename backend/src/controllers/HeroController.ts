import { Request, Response } from 'express';
import { heroService } from '../services/HeroService';

export class HeroController {
  async getAllHeroes(req: Request, res: Response) {
    try {
      const { role, difficulty, lane, search } = req.query;

      const filters = {
        role: role as string,
        difficulty: difficulty ? parseInt(difficulty as string) : undefined,
        lane: lane as string,
        search: req.query.search as string
      };

      const heroes = await heroService.getAllHeroes(filters);

      res.json({
        success: true,
        data: heroes
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getHeroById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const hero = await heroService.getHeroById(id);

      if (!hero) {
        return res.status(404).json({
          success: false,
          message: 'Hero not found'
        });
      }

      res.json({
        success: true,
        data: hero
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getHeroesByRole(req: Request, res: Response) {
    try {
      const { role } = req.params;
      const heroes = await heroService.getHeroesByRole(role);

      res.json({
        success: true,
        data: heroes
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getHeroMetaStats(req: Request, res: Response) {
    try {
      const stats = await heroService.getHeroMetaStats();

      res.json({
        success: true,
        data: stats
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getHeroSkills(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const skills = await heroService.getHeroSkills(id);

      res.json({
        success: true,
        data: skills
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getHeroCounters(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const counters = await heroService.getHeroCounters(id);

      res.json({
        success: true,
        data: counters
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getPopularHeroes(req: Request, res: Response) {
    try {
      const { role, limit } = req.query;
      const heroes = await heroService.getPopularHeroes(
        role as string, 
        limit ? parseInt(limit as string) : 10
      );

      res.json({
        success: true,
        data: heroes
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getMetaTierList(req: Request, res: Response) {
    try {
      const tierList = await heroService.getMetaTierList();

      res.json({
        success: true,
        data: tierList
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

export const heroController = new HeroController();
