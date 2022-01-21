"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketUserService = exports.CHECK_ONLINE_STATUS_SCHEDULE = exports.CONNECTED_ROOM_REDIS_KEY = exports.CONNECTED_USER_REDIS_KEY = void 0;
const common_1 = require("@nestjs/common");
const nestjs_redis_1 = require("nestjs-redis");
const lodash_1 = require("lodash");
const websockets_1 = require("@nestjs/websockets");
exports.CONNECTED_USER_REDIS_KEY = 'connected_users';
exports.CONNECTED_ROOM_REDIS_KEY = 'user:';
exports.CHECK_ONLINE_STATUS_SCHEDULE = 'CHECK_ONLINE_STATUS_SCHEDULE';
let SocketUserService = class SocketUserService {
    constructor(redisService) {
        this.redisService = redisService;
    }
    async addConnection(sourceId, socketId) {
        const redisClient = this.redisService.getClient();
        await redisClient.sadd(exports.CONNECTED_USER_REDIS_KEY, sourceId.toString());
        await redisClient.sadd(sourceId.toString(), socketId);
    }
    async getUserSocketIds(id) {
        const redisClient = this.redisService.getClient();
        const results = await redisClient.smembers(id);
        return results;
    }
    async userGetAllConnectedRooms(id) {
        const redisClient = this.redisService.getClient();
        const results = await redisClient.smembers(exports.CONNECTED_ROOM_REDIS_KEY + id);
        return results;
    }
    async removeConnection(sourceId, socketId) {
        const redisClient = this.redisService.getClient();
        await redisClient.srem(sourceId.toString(), socketId);
        const len = await redisClient.scard(sourceId.toString());
        if (!len) {
            await redisClient.srem(exports.CONNECTED_USER_REDIS_KEY, sourceId.toString());
        }
        return len;
    }
    async addConnectionToRoom(roomId, userId, value) {
        const redisClient = this.redisService.getClient();
        await redisClient.hset(`room-${roomId}`, userId, `${value},${new Date().getTime()}`);
        await redisClient.sadd(exports.CONNECTED_ROOM_REDIS_KEY + userId, roomId);
    }
    async removeConnectionFromRoom(roomId, userId) {
        const redisClient = this.redisService.getClient();
        await redisClient.hdel(`room-${roomId}`, userId);
        await redisClient.srem(exports.CONNECTED_ROOM_REDIS_KEY + userId, roomId);
    }
    async getConnectionValue(roomId, userId) {
        const redisClient = this.redisService.getClient();
        const results = await redisClient.hmget(`room-${roomId}`, ...[userId]);
        return results[0];
    }
    async getRoomUserConnections(roomId) {
        const redisClient = this.redisService.getClient();
        const results = await redisClient.hgetall(`room-${roomId}`);
        return results;
    }
    async countRoomUserConnections(roomId) {
        const redisClient = this.redisService.getClient();
        const total = await redisClient.hlen(`room-${roomId}`);
        return total;
    }
    async emitToUsers(userIds, eventName, data) {
        const stringIds = lodash_1.uniq(Array.isArray(userIds) ? userIds : [userIds]).map(i => i.toString());
        const redisClient = this.redisService.getClient();
        Promise.all(stringIds.map(async (userId) => {
            const socketIds = await redisClient.smembers(userId);
            (socketIds || []).forEach(socketId => this.server.to(socketId).emit(eventName, data));
        }));
    }
    async emitToRoom(roomName, eventName, data) {
        this.server.to(roomName).emit(eventName, data);
    }
    async emitToConnectedUsers(eventName, data) {
        const connectedUsers = this.server.clients().connected;
        const ids = Object.keys(connectedUsers).map(id => id);
        if (!ids.length) {
            return;
        }
        await Promise.all(ids.map(id => this.server.to(id).emit(eventName, data)));
    }
    async getConnectedSocket() {
        return this.server.clients().connected;
    }
};
__decorate([
    websockets_1.WebSocketServer(),
    __metadata("design:type", Object)
], SocketUserService.prototype, "server", void 0);
SocketUserService = __decorate([
    common_1.Injectable(),
    websockets_1.WebSocketGateway(),
    __metadata("design:paramtypes", [nestjs_redis_1.RedisService])
], SocketUserService);
exports.SocketUserService = SocketUserService;
//# sourceMappingURL=socket-user.service.js.map