import { AuthenticatedRequest } from "../middleware/auth";
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
export declare class SocialController {
    getPosts(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    createPost(req: AuthRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    getPostComments(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    createComment(req: AuthRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    toggleLike(req: AuthRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    toggleFollow(req: AuthRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    getUserFollowers(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    getUserFollowing(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    getUserFeed(req: AuthRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
export declare const socialController: SocialController;
//# sourceMappingURL=SocialController.d.ts.map