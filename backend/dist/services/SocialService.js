"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socialService = exports.SocialService = void 0;
// backend/src/services/SocialService.ts
const client_1 = require("@prisma/client");
const authMiddleware_1 = require("../middleware/authMiddleware");
const prisma = new client_1.PrismaClient();
class SocialService {
    // Follow system
    async followUser(followerId, followingId) {
        if (followerId === followingId) {
            throw new authMiddleware_1.AuthMiddlewareError('Cannot follow yourself', 400);
        }
        return await prisma.$transaction(async (tx) => {
            const existingFollow = await tx.follow.findUnique({
                where: {
                    followerId_followingId: {
                        followerId,
                        followingId
                    }
                }
            });
            if (existingFollow) {
                await tx.follow.delete({
                    where: { id: existingFollow.id }
                });
                return { following: false };
            }
            else {
                await tx.follow.create({
                    data: {
                        followerId,
                        followingId
                    }
                });
                await tx.notification.create({
                    data: {
                        type: 'NEW_FOLLOWER',
                        title: 'Новый подписчик',
                        content: 'На вас подписался новый пользователь',
                        userId: followingId,
                        actorId: followerId
                    }
                });
                return { following: true };
            }
        });
    }
    async getFollowers(userId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [follows, total] = await Promise.all([
            prisma.follow.findMany({
                where: { followingId: userId },
                include: {
                    follower: {
                        select: {
                            id: true,
                            username: true,
                            avatar: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.follow.count({
                where: { followingId: userId }
            })
        ]);
        return {
            followers: follows.map(f => f.follower),
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        };
    }
    async getFollowing(userId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [follows, total] = await Promise.all([
            prisma.follow.findMany({
                where: { followerId: userId },
                include: {
                    following: {
                        select: {
                            id: true,
                            username: true,
                            avatar: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.follow.count({
                where: { followerId: userId }
            })
        ]);
        return {
            following: follows.map(f => f.following),
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        };
    }
    // Notifications
    async getNotifications(userId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [notifications, total] = await Promise.all([
            prisma.notification.findMany({
                where: { userId },
                include: {
                    actor: {
                        select: {
                            id: true,
                            username: true,
                            avatar: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.notification.count({
                where: { userId }
            })
        ]);
        return {
            notifications,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        };
    }
    async markNotificationAsRead(notificationId, userId) {
        const notification = await prisma.notification.findUnique({
            where: { id: notificationId }
        });
        if (!notification) {
            throw new authMiddleware_1.AuthMiddlewareError('Notification not found', 404);
        }
        if (notification.userId !== userId) {
            throw new authMiddleware_1.AuthMiddlewareError('Not authorized', 403);
        }
        return await prisma.notification.update({
            where: { id: notificationId },
            data: { isRead: true }
        });
    }
    async markAllNotificationsAsRead(userId) {
        return await prisma.notification.updateMany({
            where: {
                userId,
                isRead: false
            },
            data: { isRead: true }
        });
    }
    async getUnreadNotificationCount(userId) {
        const count = await prisma.notification.count({
            where: {
                userId,
                isRead: false
            }
        });
        return { count };
    }
    // User profile social stats
    async getUserSocialStats(userId) {
        const [followerCount, followingCount, postCount, likeCount] = await Promise.all([
            prisma.follow.count({ where: { followingId: userId } }),
            prisma.follow.count({ where: { followerId: userId } }),
            prisma.post.count({
                where: {
                    authorId: userId,
                    status: 'PUBLISHED'
                }
            }),
            prisma.like.count({
                where: {
                    OR: [
                        { post: { authorId: userId } },
                        { comment: { authorId: userId } }
                    ]
                }
            })
        ]);
        return {
            followerCount,
            followingCount,
            postCount,
            likeCount
        };
    }
    // Feed
    async getUserFeed(userId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const following = await prisma.follow.findMany({
            where: { followerId: userId },
            select: { followingId: true }
        });
        const followingIds = following.map(f => f.followingId);
        followingIds.push(userId);
        const [posts, total] = await Promise.all([
            prisma.post.findMany({
                where: {
                    authorId: { in: followingIds },
                    status: 'PUBLISHED'
                },
                include: {
                    author: {
                        select: {
                            id: true,
                            username: true,
                            avatar: true,
                            role: true
                        }
                    },
                    hero: true,
                    build: true,
                    tags: true,
                    media: true,
                    _count: {
                        select: {
                            comments: true,
                            likes: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.post.count({
                where: {
                    authorId: { in: followingIds },
                    status: 'PUBLISHED'
                }
            })
        ]);
        return {
            posts,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        };
    }
    // Посты
    async createPost(data) {
        const { tags, ...postData } = data;
        return prisma.post.create({
            data: {
                ...postData,
                tags: tags ? {
                    create: tags.map(name => ({ name }))
                } : undefined
            },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true
                    }
                },
                hero: true,
                build: true,
                tags: true,
                _count: {
                    select: {
                        likes: true,
                        comments: true
                    }
                }
            }
        });
    }
    async getPosts(filters = {}) {
        const page = filters.page || 1;
        const limit = filters.limit || 20;
        const skip = (page - 1) * limit;
        const where = {
            status: 'PUBLISHED'
        };
        if (filters.type)
            where.type = filters.type;
        if (filters.authorId)
            where.authorId = filters.authorId;
        if (filters.heroId)
            where.heroId = filters.heroId;
        if (filters.buildId)
            where.buildId = filters.buildId;
        if (filters.tag) {
            where.tags = {
                some: {
                    name: filters.tag
                }
            };
        }
        const [posts, total] = await Promise.all([
            prisma.post.findMany({
                where,
                include: {
                    author: {
                        select: {
                            id: true,
                            username: true,
                            avatar: true
                        }
                    },
                    hero: true,
                    build: true,
                    tags: true,
                    _count: {
                        select: {
                            likes: true,
                            comments: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip,
                take: limit
            }),
            prisma.post.count({ where })
        ]);
        return {
            posts,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        };
    }
    // Комментарии
    async createComment(data) {
        return prisma.comment.create({
            data,
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true
                    }
                },
                _count: {
                    select: {
                        likes: true,
                        replies: true
                    }
                }
            }
        });
    }
    async getPostComments(postId, page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        const [comments, total] = await Promise.all([
            prisma.comment.findMany({
                where: {
                    postId,
                    parentId: null,
                    status: 'ACTIVE'
                },
                include: {
                    author: {
                        select: {
                            id: true,
                            username: true,
                            avatar: true
                        }
                    },
                    replies: {
                        include: {
                            author: {
                                select: {
                                    id: true,
                                    username: true,
                                    avatar: true
                                }
                            },
                            _count: {
                                select: {
                                    likes: true
                                }
                            }
                        },
                        orderBy: {
                            createdAt: 'asc'
                        }
                    },
                    _count: {
                        select: {
                            likes: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip,
                take: limit
            }),
            prisma.comment.count({
                where: {
                    postId,
                    parentId: null,
                    status: 'ACTIVE'
                }
            })
        ]);
        return {
            comments,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        };
    }
    // Лайки
    async toggleLike(userId, data) {
        const { postId, commentId, buildId, type = client_1.LikeType.LIKE } = data;
        const existingLike = await prisma.like.findFirst({
            where: {
                userId,
                postId: postId || null,
                commentId: commentId || null,
                buildId: buildId || null
            }
        });
        if (existingLike) {
            await prisma.like.delete({
                where: { id: existingLike.id }
            });
            if (postId) {
                await prisma.post.update({
                    where: { id: postId },
                    data: { likeCount: { decrement: 1 } }
                });
            }
            return { liked: false };
        }
        else {
            await prisma.like.create({
                data: {
                    userId,
                    postId,
                    commentId,
                    buildId,
                    type
                }
            });
            if (postId) {
                await prisma.post.update({
                    where: { id: postId },
                    data: { likeCount: { increment: 1 } }
                });
            }
            return { liked: true };
        }
    }
    // Подписки - ОПТИМИЗИРОВАННЫЕ ВЕРСИИ С ПАГИНАЦИЕЙ
    async getUserFollowers(userId, page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        const [follows, total] = await Promise.all([
            prisma.follow.findMany({
                where: { followingId: userId },
                include: {
                    follower: {
                        select: {
                            id: true,
                            username: true,
                            avatar: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.follow.count({
                where: { followingId: userId }
            })
        ]);
        return {
            followers: follows.map(f => f.follower),
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        };
    }
    async getUserFollowing(userId, page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        const [follows, total] = await Promise.all([
            prisma.follow.findMany({
                where: { followerId: userId },
                include: {
                    following: {
                        select: {
                            id: true,
                            username: true,
                            avatar: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.follow.count({
                where: { followerId: userId }
            })
        ]);
        return {
            following: follows.map(f => f.following),
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        };
    }
    async toggleFollow(followerId, followingId) {
        const existingFollow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId
                }
            }
        });
        if (existingFollow) {
            await prisma.follow.delete({
                where: { id: existingFollow.id }
            });
            return { following: false };
        }
        else {
            await prisma.follow.create({
                data: {
                    followerId,
                    followingId
                }
            });
            return { following: true };
        }
    }
}
exports.SocialService = SocialService;
exports.socialService = new SocialService();
//# sourceMappingURL=SocialService.js.map