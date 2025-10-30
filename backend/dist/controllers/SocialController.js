"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socialController = exports.SocialController = void 0;
const SocialService_1 = require("../services/SocialService");
class SocialController {
    async getPosts(req, res, next) {
        try {
            const { page = 1, limit = 20, type, authorId, heroId, buildId, tag } = req.query;
            const result = await SocialService_1.socialService.getPosts({
                page: Number(page),
                limit: Number(limit),
                type: type,
                authorId: authorId,
                heroId: heroId,
                buildId: buildId,
                tag: tag
            });
            res.json({
                success: true,
                data: result.posts,
                pagination: result.pagination
            });
        }
        catch (error) {
            next(error);
        }
    }
    async createPost(req, res, next) {
        try {
            if (!req.user) {
                return res.status(401).json({ success: false, error: 'Not authenticated' });
            }
            const postData = {
                ...req.body,
                authorId: req.user.userId
            };
            const post = await SocialService_1.socialService.createPost(postData);
            res.status(201).json({
                success: true,
                data: post
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getPostComments(req, res, next) {
        try {
            const { postId } = req.params;
            const { page = 1, limit = 50 } = req.query;
            const result = await SocialService_1.socialService.getPostComments(postId, Number(page), Number(limit));
            res.json({
                success: true,
                data: result.comments,
                pagination: result.pagination
            });
        }
        catch (error) {
            next(error);
        }
    }
    async createComment(req, res, next) {
        try {
            if (!req.user) {
                return res.status(401).json({ success: false, error: 'Not authenticated' });
            }
            const commentData = {
                ...req.body,
                authorId: req.user.userId
            };
            const comment = await SocialService_1.socialService.createComment(commentData);
            res.status(201).json({
                success: true,
                data: comment
            });
        }
        catch (error) {
            next(error);
        }
    }
    async toggleLike(req, res, next) {
        try {
            if (!req.user) {
                return res.status(401).json({ success: false, error: 'Not authenticated' });
            }
            const result = await SocialService_1.socialService.toggleLike(req.user.userId, req.body);
            res.json({
                success: true,
                data: result
            });
        }
        catch (error) {
            next(error);
        }
    }
    async toggleFollow(req, res, next) {
        try {
            if (!req.user) {
                return res.status(401).json({ success: false, error: 'Not authenticated' });
            }
            const { targetUserId } = req.body;
            const result = await SocialService_1.socialService.toggleFollow(req.user.userId, targetUserId);
            res.json({
                success: true,
                data: result
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getUserFollowers(req, res, next) {
        try {
            const { userId } = req.params;
            const { page = 1, limit = 50 } = req.query;
            const result = await SocialService_1.socialService.getUserFollowers(userId, Number(page), Number(limit));
            res.json({
                success: true,
                data: result.followers,
                pagination: result.pagination
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getUserFollowing(req, res, next) {
        try {
            const { userId } = req.params;
            const { page = 1, limit = 50 } = req.query;
            const result = await SocialService_1.socialService.getUserFollowing(userId, Number(page), Number(limit));
            res.json({
                success: true,
                data: result.following,
                pagination: result.pagination
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getUserFeed(req, res, next) {
        try {
            if (!req.user) {
                return res.status(401).json({ success: false, error: 'Not authenticated' });
            }
            const { page = 1, limit = 20 } = req.query;
            const result = await SocialService_1.socialService.getUserFeed(req.user.userId, Number(page), Number(limit));
            res.json({
                success: true,
                data: result.posts,
                pagination: result.pagination
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.SocialController = SocialController;
exports.socialController = new SocialController();
//# sourceMappingURL=SocialController.js.map