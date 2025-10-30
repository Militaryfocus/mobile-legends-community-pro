"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSocketService = exports.setupSocket = exports.SocketService = void 0;
const client_1 = require("@prisma/client");
const AuthService_1 = require("./AuthService");
const prisma = new client_1.PrismaClient();
class SocketService {
    constructor(io) {
        this.onlineUsers = new Map(); // userId -> socketId
        this.io = io;
        this.setupSocketHandlers();
    }
    setupSocketHandlers() {
        this.io.use(this.authenticateSocket.bind(this));
        this.io.on('connection', this.handleConnection.bind(this));
    }
    async authenticateSocket(socket, next) {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error('Authentication error: Token required'));
            }
            const payload = await AuthService_1.authService.validateToken(token);
            if (!payload) {
                return next(new Error('Authentication error: Invalid token'));
            }
            // Получаем данные пользователя
            const user = await prisma.user.findUnique({
                where: { id: payload.userId },
                select: {
                    id: true,
                    username: true,
                    avatar: true,
                    role: true
                }
            });
            if (!user) {
                return next(new Error('Authentication error: User not found'));
            }
            socket.userId = user.id;
            socket.username = user.username;
            next();
        }
        catch (error) {
            next(new Error('Authentication error'));
        }
    }
    async handleConnection(socket) {
        if (!socket.userId)
            return;
        console.log(`User ${socket.username} connected`);
        // Добавляем пользователя в онлайн
        this.onlineUsers.set(socket.userId, socket.id);
        // Уведомляем о подключении
        this.io.emit('user_online', {
            userId: socket.userId,
            username: socket.username,
            online: true
        });
        // Присоединяем к комнатам
        socket.join(`user:${socket.userId}`); // Личная комната пользователя
        socket.join('global'); // Глобальная комната
        // Обработчики событий
        this.setupMessageHandlers(socket);
        // Отправляем текущий список онлайн пользователей
        this.sendOnlineUsers();
        socket.on('disconnect', () => {
            this.handleDisconnect(socket);
        });
        socket.on('error', (error) => {
            console.error('Socket error:', error);
        });
    }
    setupMessageHandlers(socket) {
        // Чат сообщения
        socket.on('send_message', async (data) => {
            await this.handleSendMessage(socket, data);
        });
        // Присоединение к комнате чата
        socket.on('join_room', (room) => {
            socket.join(room);
            console.log(`User ${socket.username} joined room: ${room}`);
        });
        // Покидание комнаты чата
        socket.on('leave_room', (room) => {
            socket.leave(room);
            console.log(`User ${socket.username} left room: ${room}`);
        });
        // Typing indicators
        socket.on('typing_start', (data) => {
            socket.to(data.room).emit('user_typing', {
                userId: socket.userId,
                username: socket.username,
                typing: true
            });
        });
        socket.on('typing_stop', (data) => {
            socket.to(data.room).emit('user_typing', {
                userId: socket.userId,
                username: socket.username,
                typing: false
            });
        });
        // Like notifications
        socket.on('like_post', async (data) => {
            await this.handleLikePost(socket, data);
        });
        // Match updates
        socket.on('subscribe_matches', (userId) => {
            socket.join(`matches:${userId}`);
        });
    }
    async handleSendMessage(socket, data) {
        try {
            if (!socket.userId || !data.content.trim())
                return;
            const message = {
                id: Date.now().toString(), // Временный ID
                content: data.content.trim(),
                userId: socket.userId,
                username: socket.username,
                avatar: '', // Можно добавить получение аватара
                timestamp: new Date(),
                room: data.room
            };
            // Сохраняем сообщение в базу (если нужно)
            if (data.room.startsWith('room:')) {
                await this.saveChatMessage(message);
            }
            // Отправляем сообщение в комнату
            this.io.to(data.room).emit('new_message', message);
            // Отправляем уведомление пользователям в комнате (кроме отправителя)
            socket.to(data.room).emit('message_notification', {
                room: data.room,
                message: message.content,
                from: socket.username
            });
        }
        catch (error) {
            console.error('Error handling message:', error);
            socket.emit('error', { message: 'Failed to send message' });
        }
    }
    async handleLikePost(socket, data) {
        try {
            // Находим пост и автора
            const post = await prisma.post.findUnique({
                where: { id: data.postId },
                include: { author: true }
            });
            if (!post || !socket.userId)
                return;
            // Отправляем уведомление автору поста
            this.sendNotification(post.authorId, {
                type: 'LIKE_POST',
                title: 'Новый лайк',
                content: `Пользователю понравился ваш пост "${post.title}"`,
                data: {
                    postId: post.id,
                    postTitle: post.title,
                    fromUserId: socket.userId,
                    fromUsername: socket.username
                }
            });
        }
        catch (error) {
            console.error('Error handling like:', error);
        }
    }
    async saveChatMessage(message) {
        // Здесь можно сохранять сообщения в базу данных
        // Пока просто логируем
        console.log('Chat message saved:', message);
    }
    handleDisconnect(socket) {
        if (!socket.userId)
            return;
        console.log(`User ${socket.username} disconnected`);
        // Удаляем пользователя из онлайн
        this.onlineUsers.delete(socket.userId);
        // Уведомляем об отключении
        this.io.emit('user_online', {
            userId: socket.userId,
            username: socket.username,
            online: false
        });
        // Обновляем список онлайн пользователей
        this.sendOnlineUsers();
    }
    // Public methods для использования в других сервисах
    async sendNotification(userId, notification) {
        const socketId = this.onlineUsers.get(userId);
        if (socketId) {
            this.io.to(socketId).emit('notification', notification);
        }
        // Также сохраняем уведомление в базу
        await this.saveNotification(userId, notification);
    }
    async broadcastMatchUpdate(matchData) {
        this.io.to('global').emit('match_update', matchData);
    }
    async sendUserMatchUpdate(userId, matchData) {
        this.io.to(`matches:${userId}`).emit('user_match_update', matchData);
    }
    async sendBuildFeaturedNotification(buildId, authorId) {
        const notification = {
            type: 'BUILD_FEATURED',
            title: 'Сборка выделена',
            content: 'Ваша сборка была выделена администратором',
            data: { buildId }
        };
        await this.sendNotification(authorId, notification);
    }
    // Utility methods
    async saveNotification(userId, notification) {
        try {
            await prisma.notification.create({
                data: {
                    type: notification.type,
                    title: notification.title,
                    content: notification.content,
                    userId: userId,
                    actorId: notification.data?.fromUserId,
                    data: notification.data
                }
            });
        }
        catch (error) {
            console.error('Error saving notification:', error);
        }
    }
    sendOnlineUsers() {
        const onlineUsers = Array.from(this.onlineUsers.entries()).map(([userId, socketId]) => ({
            userId,
            socketId
        }));
        this.io.emit('online_users', {
            count: onlineUsers.length,
            users: onlineUsers
        });
    }
    getOnlineUsersCount() {
        return this.onlineUsers.size;
    }
    isUserOnline(userId) {
        return this.onlineUsers.has(userId);
    }
}
exports.SocketService = SocketService;
// Singleton instance
let socketService;
const setupSocket = (io) => {
    socketService = new SocketService(io);
    return socketService;
};
exports.setupSocket = setupSocket;
const getSocketService = () => {
    if (!socketService) {
        throw new Error('SocketService not initialized');
    }
    return socketService;
};
exports.getSocketService = getSocketService;
//# sourceMappingURL=socketService.js.map