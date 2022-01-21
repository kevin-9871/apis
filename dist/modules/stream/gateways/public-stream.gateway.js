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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicStreamWsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const mongoose_1 = require("mongoose");
const common_1 = require("@nestjs/common");
const services_1 = require("../../auth/services");
const services_2 = require("../services");
const constant_1 = require("../constant");
const socket_user_service_1 = require("../../socket/services/socket-user.service");
const string_helper_1 = require("../../../kernel/helpers/string.helper");
const services_3 = require("../../user/services");
const dtos_1 = require("../../user/dtos");
const moment = require("moment");
const services_4 = require("../../performer/services");
const services_5 = require("../../message/services");
const lodash_1 = require("lodash");
const dtos_2 = require("../../auth/dtos");
const stream_provider_1 = require("../providers/stream.provider");
let PublicStreamWsGateway = class PublicStreamWsGateway {
    constructor(streamModel, authService, streamService, socketService, userService, performerService, conversationService) {
        this.streamModel = streamModel;
        this.authService = authService;
        this.streamService = streamService;
        this.socketService = socketService;
        this.userService = userService;
        this.performerService = performerService;
        this.conversationService = conversationService;
    }
    async goLive(client, payload) {
        try {
            const { conversationId } = payload;
            if (!conversationId) {
                return;
            }
            const conversation = await this.conversationService.findById(conversationId);
            if (!conversation)
                return;
            const { token } = client.handshake.query;
            if (!token)
                return;
            const user = await this.authService.getSourceFromJWT(token);
            if (!user)
                return;
            const roomName = this.conversationService.serializeConversation(conversation._id, conversation.type);
            this.socketService.emitToRoom(roomName, 'join-broadcaster', {
                performerId: user._id
            });
            await Promise.all([
                this.performerService.goLive(user._id),
                this.performerService.setStreamingStatus(user._id, constant_1.PUBLIC_CHAT),
                this.streamModel.updateOne({ _id: conversation.streamId }, { $set: { isStreaming: true } })
            ]);
        }
        catch (error) {
            console.log(error);
        }
    }
    async handleJoinPublicRoom(client, payload) {
        try {
            const { token } = client.handshake.query;
            const { conversationId } = payload;
            if (!conversationId) {
                return;
            }
            const conversation = await this.conversationService.findById(conversationId);
            if (!conversation) {
                return;
            }
            const { performerId, type } = conversation;
            const decodeded = token && (await this.authService.verifyJWT(token));
            let user;
            const authUser = lodash_1.pick(decodeded, [
                'source',
                'sourceId',
                'authId'
            ]);
            if (authUser && authUser.source === 'user') {
                user = await this.userService.findById(authUser.sourceId);
            }
            if (authUser && authUser.source === 'performer') {
                user = await this.performerService.findById(authUser.sourceId);
            }
            const roomName = this.conversationService.serializeConversation(conversationId, type);
            client.join(roomName);
            let role = 'guest';
            if (user) {
                role = authUser && authUser.source === 'user' ? 'member' : 'model';
                await this.socketService.emitToRoom(roomName, `message_created_conversation_${conversation._id}`, {
                    text: `${user.username} has joined this conversation`,
                    _id: string_helper_1.generateUuid(),
                    conversationId: conversation._id,
                    isSystem: true
                });
            }
            await this.socketService.addConnectionToRoom(roomName, user ? user._id : client.id, role);
            const connections = await this.socketService.getRoomUserConnections(roomName);
            const memberIds = [];
            Object.keys(connections).forEach(id => {
                const value = connections[id].split(',');
                if (value[0] === 'member') {
                    memberIds.push(id);
                }
            });
            if (memberIds.length && role === 'model' && `${user._id}` === `${conversation.performerId}`) {
                await this.socketService.emitToUsers(memberIds, 'model-joined', {
                    conversationId
                });
            }
            const members = memberIds.length
                ? await this.userService.findByIds(memberIds)
                : [];
            const data = {
                total: members.length,
                members: members.map(m => new dtos_1.UserDto(m).toResponse()),
                conversationId
            };
            this.socketService.emitToRoom(roomName, 'public-room-changed', data);
            const stream = await this.streamService.findByPerformerId(performerId, {
                type: constant_1.PUBLIC_CHAT,
                isStreaming: true
            });
            if (stream) {
                this.socketService.emitToRoom(roomName, 'join-broadcaster', {
                    performerId
                });
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    async handleReJoinPublicRoom(client, payload) {
        try {
            const { token } = client.handshake.query;
            const { conversationId } = payload;
            if (!conversationId) {
                return;
            }
            const conversation = await this.conversationService.findById(conversationId);
            if (!conversation) {
                return;
            }
            const { type } = conversation;
            const decodeded = token && (await this.authService.verifyJWT(token));
            let user;
            const authUser = lodash_1.pick(decodeded, [
                'source',
                'sourceId',
                'authId'
            ]);
            if (authUser && authUser.source === 'user') {
                user = await this.userService.findById(authUser.sourceId);
            }
            if (authUser && authUser.source === 'performer') {
                user = await this.performerService.findById(authUser.sourceId);
            }
            const roomName = this.conversationService.serializeConversation(conversationId, type);
            if (!client.rooms[roomName]) {
                client.join(roomName);
            }
            let role = 'guest';
            if (user) {
                role = authUser && authUser.source === 'user' ? 'member' : 'model';
                await this.socketService.emitToRoom(roomName, `message_created_conversation_${conversation._id}`, {
                    text: `${user.username} has joined this conversation`,
                    _id: string_helper_1.generateUuid(),
                    conversationId: conversation._id,
                    isSystem: true
                });
            }
            const connection = await this.socketService.getConnectionValue(roomName, user ? user._id : client.id);
            if (!connection) {
                await this.socketService.addConnectionToRoom(roomName, user ? user._id : client.id, role);
            }
            const connections = await this.socketService.getRoomUserConnections(roomName);
            const memberIds = [];
            Object.keys(connections).forEach(id => {
                const value = connections[id].split(',');
                if (value[0] === 'member') {
                    memberIds.push(id);
                }
            });
            if (memberIds.length && role === 'model' && `${user._id}` === `${conversation.performerId}`) {
                await this.socketService.emitToUsers(memberIds, 'model-joined', {
                    conversationId
                });
            }
            const members = memberIds.length
                ? await this.userService.findByIds(memberIds)
                : [];
            const data = {
                total: members.length,
                members: members.map(m => new dtos_1.UserDto(m).toResponse()),
                conversationId
            };
            this.socketService.emitToRoom(roomName, 'public-room-changed', data);
        }
        catch (e) {
            console.log(e);
        }
    }
    async handleLeavePublicRoom(client, payload) {
        try {
            const { token } = client.handshake.query;
            const { conversationId } = payload;
            if (!conversationId) {
                return;
            }
            const conversation = payload.conversationId &&
                (await this.conversationService.findById(conversationId));
            if (!conversation) {
                return;
            }
            const { performerId, type } = conversation;
            const [user] = await Promise.all([
                token && this.authService.getSourceFromJWT(token)
            ]);
            const roomName = this.conversationService.serializeConversation(conversationId, type);
            client.leave(roomName);
            const [stream] = await Promise.all([
                this.streamService.findByPerformerId(performerId, {
                    type: constant_1.PUBLIC_CHAT
                })
            ]);
            if (user) {
                await this.socketService.emitToRoom(roomName, `message_created_conversation_${payload.conversationId}`, {
                    text: `${user.username} has left this conversation`,
                    _id: string_helper_1.generateUuid(),
                    conversationId: payload.conversationId,
                    isSystem: true
                });
                const results = await this.socketService.getConnectionValue(roomName, user._id);
                if (results) {
                    const values = results.split(',');
                    const timeJoined = values[1] ? parseInt(values[1], 10) : null;
                    const role = values[0];
                    if (timeJoined) {
                        const streamTime = moment()
                            .toDate()
                            .getTime() - timeJoined;
                        if (role === 'model' && `${user._id}` === `${performerId}`) {
                            await Promise.all([
                                this.performerService.updateLastStreamingTime(user._id, streamTime),
                                stream &&
                                    stream.isStreaming &&
                                    this.streamModel.updateOne({ _id: stream._id }, {
                                        $set: {
                                            lastStreamingTime: new Date(),
                                            isStreaming: false
                                        }
                                    }),
                                this.socketService.emitToRoom(roomName, 'model-left', {
                                    performerId
                                })
                            ]);
                        }
                        else if (role === 'member') {
                            await this.userService.updateStats(user._id, {
                                'stats.totalViewTime': streamTime
                            });
                        }
                    }
                }
            }
            await this.socketService.removeConnectionFromRoom(roomName, user ? user._id : client.id);
            const connections = await this.socketService.getRoomUserConnections(roomName);
            const memberIds = [];
            Object.keys(connections).forEach(id => {
                const value = connections[id].split(',');
                if (value[0] === 'member') {
                    memberIds.push(id);
                }
            });
            const members = memberIds.length
                ? await this.userService.findByIds(memberIds)
                : [];
            const data = {
                total: members.length,
                members: members.map(m => new dtos_1.UserDto(m).toResponse()),
                conversationId
            };
            await this.socketService.emitToRoom(roomName, 'public-room-changed', data);
        }
        catch (e) {
        }
    }
};
__decorate([
    websockets_1.SubscribeMessage('public-stream/live'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PublicStreamWsGateway.prototype, "goLive", null);
__decorate([
    websockets_1.SubscribeMessage('public-stream/join'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PublicStreamWsGateway.prototype, "handleJoinPublicRoom", null);
__decorate([
    websockets_1.SubscribeMessage('public-stream/rejoin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PublicStreamWsGateway.prototype, "handleReJoinPublicRoom", null);
__decorate([
    websockets_1.SubscribeMessage('public-stream/leave'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PublicStreamWsGateway.prototype, "handleLeavePublicRoom", null);
PublicStreamWsGateway = __decorate([
    websockets_1.WebSocketGateway(),
    __param(0, common_1.Inject(stream_provider_1.STREAM_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        services_1.AuthService,
        services_2.StreamService,
        socket_user_service_1.SocketUserService,
        services_3.UserService,
        services_4.PerformerService,
        services_5.ConversationService])
], PublicStreamWsGateway);
exports.PublicStreamWsGateway = PublicStreamWsGateway;
//# sourceMappingURL=public-stream.gateway.js.map