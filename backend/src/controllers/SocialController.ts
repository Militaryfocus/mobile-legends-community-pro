import { AuthenticatedRequest } from "../middleware/auth";
import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { socialService } from '../services/SocialService';

export class SocialController {
  async getPosts(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 20, type, authorId, heroId, buildId, tag } = req.query;
      
      const result = await socialService.getPosts({
        page: Number(page),
        limit: Number(limit),
        type: type as any,
        authorId: authorId as string,
        heroId: heroId as string,
        buildId: buildId as string,
        tag: tag as string
      });

      res.json({
        success: true,
        data: result.posts,
        pagination: result.pagination
      });
    } catch (error: any) {
      next(error);
    }
  }

  async createPost(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Not authenticated' });
      }

      const postData = {
        ...req.body,
        authorId: req.user.userId
      };

      const post = await socialService.createPost(postData);

      res.status(201).json({
        success: true,
        data: post
      });
    } catch (error: any) {
      next(error);
    }
  }

  async getPostComments(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { postId } = req.params;
      const { page = 1, limit = 50 } = req.query;

      const result = await socialService.getPostComments(
        postId, 
        Number(page), 
        Number(limit)
      );

      res.json({
        success: true,
        data: result.comments,
        pagination: result.pagination
      });
    } catch (error: any) {
      next(error);
    }
  }

  async createComment(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Not authenticated' });
      }

      const commentData = {
        ...req.body,
        authorId: req.user.userId
      };

      const comment = await socialService.createComment(commentData);

      res.status(201).json({
        success: true,
        data: comment
      });
    } catch (error: any) {
      next(error);
    }
  }

  async toggleLike(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Not authenticated' });
      }

      const result = await socialService.toggleLike(req.user.userId, req.body);

      res.json({
        success: true,
        data: result
      });
    } catch (error: any) {
      next(error);
    }
  }

  async toggleFollow(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Not authenticated' });
      }

      const { targetUserId } = req.body;
      const result = await socialService.toggleFollow(req.user.userId, targetUserId);

      res.json({
        success: true,
        data: result
      });
    } catch (error: any) {
      next(error);
    }
  }

  async getUserFollowers(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 50 } = req.query;

      const result = await socialService.getUserFollowers(
        userId, 
        Number(page), 
        Number(limit)
      );

      res.json({
        success: true,
        data: result.followers,
        pagination: result.pagination
      });
    } catch (error: any) {
      next(error);
    }
  }

  async getUserFollowing(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 50 } = req.query;

      const result = await socialService.getUserFollowing(
        userId, 
        Number(page), 
        Number(limit)
      );

      res.json({
        success: true,
        data: result.following,
        pagination: result.pagination
      });
    } catch (error: any) {
      next(error);
    }
  }

  async getUserFeed(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Not authenticated' });
      }

      const { page = 1, limit = 20 } = req.query;
      const result = await socialService.getUserFeed(
        req.user.userId, 
        Number(page), 
        Number(limit)
      );

      res.json({
        success: true,
        data: result.posts,
        pagination: result.pagination
      });
    } catch (error: any) {
      next(error);
    }
  }
}

export const socialController = new SocialController();
