import { Router } from 'express';
import { socialController } from '../controllers/SocialController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Posts
router.get('/posts', socialController.getPosts);
router.post('/posts', authenticateToken, socialController.createPost);

// Comments
router.get('/posts/:postId/comments', socialController.getPostComments);
router.post('/comments', authenticateToken, socialController.createComment);

// Likes
router.post('/likes/toggle', authenticateToken, socialController.toggleLike);

// Follows
router.post('/follows/toggle', authenticateToken, socialController.toggleFollow);
router.get('/users/:userId/followers', socialController.getUserFollowers);
router.get('/users/:userId/following', socialController.getUserFollowing);

// Feed
router.get('/feed', authenticateToken, socialController.getUserFeed);

export default router;
