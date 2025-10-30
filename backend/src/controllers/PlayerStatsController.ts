import { Request, Response } from 'express';
import { playerStatsService } from '../services/PlayerStatsService';
import { AuthenticatedRequest } from '../middleware/auth';

export class PlayerStatsController {
  async getPlayerStats(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ success: false, message: "User not authenticated" });
      const stats = await playerStatsService.getPlayerStats(req.user.userId);
      
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

  async getHeroStats(req: Request, res: Response) {
    try {
      const { heroId } = req.params;
      const stats = await playerStatsService.getHeroStats("", heroId);
      
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

  async getRankProgress(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ success: false, message: "User not authenticated" });
      const progress = await playerStatsService.getRankProgress(req.user.userId);
      
      res.json({
        success: true,
        data: progress
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async updatePlayerStats(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ success: false, message: "User not authenticated" });
      const { heroId, result, kills, deaths, assists } = req.body;
      
      const stats = await playerStatsService.updatePlayerStats(
        req.user.userId,
        heroId,
        result,
        kills,
        deaths,
        assists
      );
      
      res.json({
        success: true,
        message: 'Stats updated successfully',
        data: stats
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getPlayerComparison(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ success: false, message: "User not authenticated" });
      const { heroId } = req.query;
      const comparison = await playerStatsService.getPlayerComparison(
        req.user.userId,
        heroId as string
      );
      
      res.json({
        success: true,
        data: comparison
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getLeaderboard(req: Request, res: Response) {
    try {
      const { type = 'overall', limit = '100' } = req.query;
      const leaderboard = await playerStatsService.getLeaderboard(
        type as string,
        parseInt(limit as string)
      );
      
      res.json({
        success: true,
        data: leaderboard
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

export const playerStatsController = new PlayerStatsController();
