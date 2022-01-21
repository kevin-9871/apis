import { RedisService } from 'nestjs-redis';
import { ObjectId } from 'mongodb';
import { Server } from 'socket.io';
export declare const CONNECTED_USER_REDIS_KEY = "connected_users";
export declare const CONNECTED_ROOM_REDIS_KEY = "user:";
export declare const CHECK_ONLINE_STATUS_SCHEDULE = "CHECK_ONLINE_STATUS_SCHEDULE";
export declare class SocketUserService {
    private readonly redisService;
    server: Server;
    constructor(redisService: RedisService);
    addConnection(sourceId: string | ObjectId, socketId: string): Promise<void>;
    getUserSocketIds(id: string): Promise<string[]>;
    userGetAllConnectedRooms(id: string): Promise<string[]>;
    removeConnection(sourceId: string | ObjectId, socketId: string): Promise<number>;
    addConnectionToRoom(roomId: string, userId: string, value: string): Promise<void>;
    removeConnectionFromRoom(roomId: string, userId: string): Promise<void>;
    getConnectionValue(roomId: string, userId: string): Promise<string>;
    getRoomUserConnections(roomId: string): Promise<Record<string, string>>;
    countRoomUserConnections(roomId: string): Promise<number>;
    emitToUsers(userIds: string | string[] | ObjectId | ObjectId[], eventName: string, data: any): Promise<void>;
    emitToRoom(roomName: string, eventName: string, data: any): Promise<void>;
    emitToConnectedUsers(eventName: string, data: any): Promise<void>;
    getConnectedSocket(): Promise<{
        [id: string]: import("socket.io").Socket;
    }>;
}
