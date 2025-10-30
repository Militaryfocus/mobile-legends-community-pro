import { AuthenticatedRequest } from "../middleware/auth";
import { Request, Response } from 'express';
import { buildService } from '../services/BuildService';

export class BuildController {
  async getAllBuilds(req: AuthenticatedRequest, res: Response) {
    try {
      const { heroId, authorId, playstyle, isPublic, page = '1', limit = '10' } = req.query;

      const filters = {
        heroId: heroId as string,
        authorId: authorId as string,
        playstyle: playstyle as string,
        isPublic: isPublic === 'true' ? true : isPublic === 'false' ? false : undefined,
        page: Number(page),
        limit: Number(limit)
      };

      const builds = await buildService.getBuilds(filters);

      res.json({
        success: true,
        data: builds.data,
        pagination: {
          page: filters.page,
          limit: filters.limit,
          total: builds.data.length,
          pages: Math.ceil(builds.data.length / filters.limit)
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getBuildById(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const build = await buildService.getBuildById(id);

      if (!build) {
        return res.status(404).json({
          success: false,
          message: 'Build not found'
        });
      }

      res.json({
        success: true,
        data: build
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async createBuild(req: AuthenticatedRequest, res: Response) {

    if (!req.user) return res.status(401).json({ success: false, message: "User not authenticated" });
    try {
      const buildData = {
        ...req.body,
        authorId: req.user?.userId
      };

      const build = await buildService.createBuild(buildData);

      res.status(201).json({
        success: true,
        message: 'Build created successfully',
        data: build
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateBuild(req: AuthenticatedRequest, res: Response) {

    if (!req.user) return res.status(401).json({ success: false, message: "User not authenticated" });
    try {
      const { id } = req.params;
      const build = await buildService.updateBuild(id, req.body, req.user?.userId);

      res.json({
        success: true,
        message: 'Build updated successfully',
        data: build
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async deleteBuild(req: AuthenticatedRequest, res: Response) {

    if (!req.user) return res.status(401).json({ success: false, message: "User not authenticated" });
    try {
      const { id } = req.params;
      await buildService.deleteBuild(id, req.user?.userId);

      res.json({
        success: true,
        message: 'Build deleted successfully'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async voteBuild(req: AuthenticatedRequest, res: Response) {

    if (!req.user) return res.status(401).json({ success: false, message: "User not authenticated" });
    try {
      const { id } = req.params;
      const { value } = req.body;

      const result = await buildService.voteBuild({
        buildId: id,
        userId: req.user?.userId,
        value
      });

      res.json({
        success: true,
        message: 'Vote recorded successfully',
        data: result
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getRecommendedBuilds(req: AuthenticatedRequest, res: Response) {
    try {
      const { heroId, playstyle = 'BALANCED' } = req.query;
      
      const builds = await buildService.getRecommendedBuilds(
        heroId as string, 
        playstyle as string
      );

      res.json({
        success: true,
        data: builds
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getProBuilds(req: AuthenticatedRequest, res: Response) {
    try {
      const { heroId } = req.query;
      
      const builds = await buildService.getProBuilds(heroId as string);

      res.json({
        success: true,
        data: builds
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

export const buildController = new BuildController();
