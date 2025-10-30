import { Server as SocketServer } from 'socket.io';
export interface ChatMessage {
    id: string;
    content: string;
    userId: string;
    username: string;
    avatar?: string;
    timestamp: Date;
    room: string;
}
export declare class SocketService {
    private io;
    private onlineUsers;
    constructor(io: SocketServer);
    private setupSocketHandlers;
    private authenticateSocket;
    private handleConnection;
    private setupMessageHandlers;
    private handleSendMessage;
    private handleLikePost;
    private saveChatMessage;
    private handleDisconnect;
    sendNotification(userId: string, notification: {
        type: string;
        title: string;
        content?: string;
        data?: any;
    }): Promise<void>;
    broadcastMatchUpdate(matchData: any): Promise<void>;
    sendUserMatchUpdate(userId: string, matchData: any): Promise<void>;
    sendBuildFeaturedNotification(buildId: string, authorId: string): Promise<void>;
    private saveNotification;
    private sendOnlineUsers;
    getOnlineUsersCount(): number;
    isUserOnline(userId: string): boolean;
}
export declare const setupSocket: (io: SocketServer) => SocketService;
export declare const getSocketService: () => SocketService;
//# sourceMappingURL=socketService.d.ts.map