import { PostType, LikeType } from '@prisma/client';
export interface CreatePostData {
    title: string;
    content: string;
    type: PostType;
    authorId: string;
    heroId?: string;
    buildId?: string;
    tags?: string[];
}
export interface CreateCommentData {
    content: string;
    authorId: string;
    postId?: string;
    parentId?: string;
}
export declare class SocialService {
    followUser(followerId: string, followingId: string): Promise<{
        following: boolean;
    }>;
    getFollowers(userId: string, page?: number, limit?: number): Promise<{
        followers: {
            username: string;
            id: string;
            avatar: string | null;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    getFollowing(userId: string, page?: number, limit?: number): Promise<{
        following: {
            username: string;
            id: string;
            avatar: string | null;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    getNotifications(userId: string, page?: number, limit?: number): Promise<{
        notifications: ({
            actor: {
                username: string;
                id: string;
                avatar: string | null;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            data: import("@prisma/client/runtime/library").JsonValue | null;
            userId: string;
            title: string;
            content: string | null;
            type: import(".prisma/client").$Enums.NotificationType;
            isRead: boolean;
            actorId: string | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    markNotificationAsRead(notificationId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        data: import("@prisma/client/runtime/library").JsonValue | null;
        userId: string;
        title: string;
        content: string | null;
        type: import(".prisma/client").$Enums.NotificationType;
        isRead: boolean;
        actorId: string | null;
    }>;
    markAllNotificationsAsRead(userId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    getUnreadNotificationCount(userId: string): Promise<{
        count: number;
    }>;
    getUserSocialStats(userId: string): Promise<{
        followerCount: number;
        followingCount: number;
        postCount: number;
        likeCount: number;
    }>;
    getUserFeed(userId: string, page?: number, limit?: number): Promise<{
        posts: ({
            media: {
                id: string;
                createdAt: Date;
                userId: string;
                type: import(".prisma/client").$Enums.MediaType;
                url: string;
                postId: string | null;
                filename: string;
                size: number;
                mimeType: string;
            }[];
            _count: {
                comments: number;
                likes: number;
            };
            author: {
                username: string;
                id: string;
                role: import(".prisma/client").$Enums.UserRole;
                avatar: string | null;
            };
            hero: {
                id: string;
                role: import(".prisma/client").$Enums.HeroRole;
                name: string;
                description: string | null;
                title: string;
                difficulty: number | null;
            } | null;
            build: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                viewCount: number;
                likeCount: number;
                authorId: string;
                heroId: string;
                isPublic: boolean;
                isFeatured: boolean;
                winRate: number | null;
                popularity: number | null;
                playstyle: import(".prisma/client").$Enums.Playstyle;
                spell1Id: string | null;
                spell2Id: string | null;
                copyCount: number;
            } | null;
            tags: {
                id: string;
                name: string;
                postId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            content: string;
            type: import(".prisma/client").$Enums.PostType;
            status: import(".prisma/client").$Enums.PostStatus;
            viewCount: number;
            likeCount: number;
            commentCount: number;
            authorId: string;
            heroId: string | null;
            buildId: string | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    createPost(data: CreatePostData): Promise<{
        _count: {
            comments: number;
            likes: number;
        };
        author: {
            username: string;
            id: string;
            avatar: string | null;
        };
        hero: {
            id: string;
            role: import(".prisma/client").$Enums.HeroRole;
            name: string;
            description: string | null;
            title: string;
            difficulty: number | null;
        } | null;
        build: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            viewCount: number;
            likeCount: number;
            authorId: string;
            heroId: string;
            isPublic: boolean;
            isFeatured: boolean;
            winRate: number | null;
            popularity: number | null;
            playstyle: import(".prisma/client").$Enums.Playstyle;
            spell1Id: string | null;
            spell2Id: string | null;
            copyCount: number;
        } | null;
        tags: {
            id: string;
            name: string;
            postId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        type: import(".prisma/client").$Enums.PostType;
        status: import(".prisma/client").$Enums.PostStatus;
        viewCount: number;
        likeCount: number;
        commentCount: number;
        authorId: string;
        heroId: string | null;
        buildId: string | null;
    }>;
    getPosts(filters?: {
        type?: PostType;
        authorId?: string;
        heroId?: string;
        buildId?: string;
        tag?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        posts: ({
            _count: {
                comments: number;
                likes: number;
            };
            author: {
                username: string;
                id: string;
                avatar: string | null;
            };
            hero: {
                id: string;
                role: import(".prisma/client").$Enums.HeroRole;
                name: string;
                description: string | null;
                title: string;
                difficulty: number | null;
            } | null;
            build: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                viewCount: number;
                likeCount: number;
                authorId: string;
                heroId: string;
                isPublic: boolean;
                isFeatured: boolean;
                winRate: number | null;
                popularity: number | null;
                playstyle: import(".prisma/client").$Enums.Playstyle;
                spell1Id: string | null;
                spell2Id: string | null;
                copyCount: number;
            } | null;
            tags: {
                id: string;
                name: string;
                postId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            content: string;
            type: import(".prisma/client").$Enums.PostType;
            status: import(".prisma/client").$Enums.PostStatus;
            viewCount: number;
            likeCount: number;
            commentCount: number;
            authorId: string;
            heroId: string | null;
            buildId: string | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    createComment(data: CreateCommentData): Promise<{
        _count: {
            likes: number;
            replies: number;
        };
        author: {
            username: string;
            id: string;
            avatar: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        status: import(".prisma/client").$Enums.CommentStatus;
        authorId: string;
        postId: string | null;
        parentId: string | null;
    }>;
    getPostComments(postId: string, page?: number, limit?: number): Promise<{
        comments: ({
            _count: {
                likes: number;
            };
            author: {
                username: string;
                id: string;
                avatar: string | null;
            };
            replies: ({
                _count: {
                    likes: number;
                };
                author: {
                    username: string;
                    id: string;
                    avatar: string | null;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                content: string;
                status: import(".prisma/client").$Enums.CommentStatus;
                authorId: string;
                postId: string | null;
                parentId: string | null;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            status: import(".prisma/client").$Enums.CommentStatus;
            authorId: string;
            postId: string | null;
            parentId: string | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    toggleLike(userId: string, data: {
        postId?: string;
        commentId?: string;
        buildId?: string;
        type?: LikeType;
    }): Promise<{
        liked: boolean;
    }>;
    getUserFollowers(userId: string, page?: number, limit?: number): Promise<{
        followers: {
            username: string;
            id: string;
            avatar: string | null;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    getUserFollowing(userId: string, page?: number, limit?: number): Promise<{
        following: {
            username: string;
            id: string;
            avatar: string | null;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    toggleFollow(followerId: string, followingId: string): Promise<{
        following: boolean;
    }>;
}
export declare const socialService: SocialService;
//# sourceMappingURL=SocialService.d.ts.map