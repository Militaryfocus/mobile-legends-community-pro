// backend/src/services/SocketService.ts
import { Server as SocketServer, Socket } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import { authService } from './AuthService';
import { CustomError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

interface AuthenticatedSocket extends Socket {
  userId?: string;
  username?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  userId: string;
  username: string;
  avatar?: string;
  timestamp: Date;
  room: string;
}

export class SocketService {
  private io: SocketServer;
  private onlineUsers: Map<string, string> = new Map(); // userId -> socketId

  constructor(io: SocketServer) {
    this.io = io;
    this.setupSocketHandlers();
  }

  private setupSocketHandlers() {
    this.io.use(this.authenticateSocket.bind(this));
    this.io.on('connection', this.handleConnection.bind(this));
  }

  private async authenticateSocket(socket: AuthenticatedSocket, next: any) {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error: Token required'));
      }

      const payload = await authService.validateToken(token);
      if (!payload) {
        return next(new Error('Authentication error: Invalid token'));
      }

      // Получаем данные пользователя
      const user = await prisma.user.findUnique({
        where: { id: (payload as any).userId },
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
    } catch (error) {
      next(new Error('Authentication error'));
    }
  }

  private async handleConnection(socket: AuthenticatedSocket) {
    if (!socket.userId) return;

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

  private setupMessageHandlers(socket: AuthenticatedSocket) {
    // Чат сообщения
    socket.on('send_message', async (data: { content: string; room: string }) => {
      await this.handleSendMessage(socket, data);
    });

    // Присоединение к комнате чата
    socket.on('join_room', (room: string) => {
      socket.join(room);
      console.log(`User ${socket.username} joined room: ${room}`);
    });

    // Покидание комнаты чата
    socket.on('leave_room', (room: string) => {
      socket.leave(room);
      console.log(`User ${socket.username} left room: ${room}`);
    });

    // Typing indicators
    socket.on('typing_start', (data: { room: string }) => {
      socket.to(data.room).emit('user_typing', {
        userId: socket.userId,
        username: socket.username,
        typing: true
      });
    });

    socket.on('typing_stop', (data: { room: string }) => {
      socket.to(data.room).emit('user_typing', {
        userId: socket.userId,
        username: socket.username,
        typing: false
      });
    });

    // Like notifications
    socket.on('like_post', async (data: { postId: string }) => {
      await this.handleLikePost(socket, data);
    });

    // Match updates
    socket.on('subscribe_matches', (userId: string) => {
      socket.join(`matches:${userId}`);
    });
  }

  private async handleSendMessage(socket: AuthenticatedSocket, data: { content: string; room: string }) {
    try {
      if (!socket.userId || !data.content.trim()) return;

      const message: ChatMessage = {
        id: Date.now().toString(), // Временный ID
        content: data.content.trim(),
        userId: socket.userId,
        username: socket.username!,
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

    } catch (error) {
      console.error('Error handling message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  }

  private async handleLikePost(socket: AuthenticatedSocket, data: { postId: string }) {
    try {
      // Находим пост и автора
      const post = await prisma.post.findUnique({
        where: { id: data.postId },
        include: { author: true }
      });

      if (!post || !socket.userId) return;

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

    } catch (error) {
      console.error('Error handling like:', error);
    }
  }

  private async saveChatMessage(message: ChatMessage) {
    // Здесь можно сохранять сообщения в базу данных
    // Пока просто логируем
    console.log('Chat message saved:', message);
  }

  private handleDisconnect(socket: AuthenticatedSocket) {
    if (!socket.userId) return;

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
  async sendNotification(userId: string, notification: {
    type: string;
    title: string;
    content?: string;
    data?: any;
  }) {
    const socketId = this.onlineUsers.get(userId);
    
    if (socketId) {
      this.io.to(socketId).emit('notification', notification);
    }

    // Также сохраняем уведомление в базу
    await this.saveNotification(userId, notification);
  }

  async broadcastMatchUpdate(matchData: any) {
    this.io.to('global').emit('match_update', matchData);
  }

  async sendUserMatchUpdate(userId: string, matchData: any) {
    this.io.to(`matches:${userId}`).emit('user_match_update', matchData);
  }

  async sendBuildFeaturedNotification(buildId: string, authorId: string) {
    const notification = {
      type: 'BUILD_FEATURED',
      title: 'Сборка выделена',
      content: 'Ваша сборка была выделена администратором',
      data: { buildId }
    };

    await this.sendNotification(authorId, notification);
  }

  // Utility methods
  private async saveNotification(userId: string, notification: any) {
    try {
      await prisma.notification.create({
        data: {
          type: notification.type as any,
          title: notification.title,
          content: notification.content,
          userId: userId,
          actorId: notification.data?.fromUserId,
          data: notification.data
        }
      });
    } catch (error) {
      console.error('Error saving notification:', error);
    }
  }

  private sendOnlineUsers() {
    const onlineUsers = Array.from(this.onlineUsers.entries()).map(([userId, socketId]) => ({
      userId,
      socketId
    }));

    this.io.emit('online_users', {
      count: onlineUsers.length,
      users: onlineUsers
    });
  }

  getOnlineUsersCount(): number {
    return this.onlineUsers.size;
  }

  isUserOnline(userId: string): boolean {
    return this.onlineUsers.has(userId);
  }
}

// Singleton instance
let socketService: SocketService;

export const setupSocket = (io: SocketServer) => {
  socketService = new SocketService(io);
  return socketService;
};

export const getSocketService = () => {
  if (!socketService) {
    throw new Error('SocketService not initialized');
  }
  return socketService;
};
