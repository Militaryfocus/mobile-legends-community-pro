"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SocialController_1 = require("../controllers/SocialController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Posts
router.get('/posts', SocialController_1.socialController.getPosts);
router.post('/posts', authMiddleware_1.authenticateToken, SocialController_1.socialController.createPost);
// Comments
router.get('/posts/:postId/comments', SocialController_1.socialController.getPostComments);
router.post('/comments', authMiddleware_1.authenticateToken, SocialController_1.socialController.createComment);
// Likes
router.post('/likes/toggle', authMiddleware_1.authenticateToken, SocialController_1.socialController.toggleLike);
// Follows
router.post('/follows/toggle', authMiddleware_1.authenticateToken, SocialController_1.socialController.toggleFollow);
router.get('/users/:userId/followers', SocialController_1.socialController.getUserFollowers);
router.get('/users/:userId/following', SocialController_1.socialController.getUserFollowing);
// Feed
router.get('/feed', authMiddleware_1.authenticateToken, SocialController_1.socialController.getUserFeed);
exports.default = router;
//# sourceMappingURL=social.js.map