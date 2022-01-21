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
exports.StreamConversationWsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const socket_user_service_1 = require("../../socket/services/socket-user.service");
const services_1 = require("../services");
const services_2 = require("../../auth/services");
const services_3 = require("../../message/services");
const mongoose_1 = require("mongoose");
const services_4 = require("../../user/services");
const dtos_1 = require("../../user/dtos");
const services_5 = require("../../performer/services");
const string_helper_1 = require("../../../kernel/helpers/string.helper");
const lodash_1 = require("lodash");
const dtos_2 = require("../../auth/dtos");
const stream_provider_1 = require("../providers/stream.provider");
const constant_1 = require("../constant");
const JOINED_THE_ROOM = 'JOINED_THE_ROOM';
const MODEL_JOIN_ROOM = 'MODEL_JOIN_ROOM';
const MODEL_LEFT_ROOM = 'MODEL_LEFT_ROOM';
const JOIN_ROOM = 'JOIN_ROOM';
const REJOIN_ROOM = 'REJOIN_ROOM';
const LEAVE_ROOM = 'LEAVE_ROOM';
let StreamConversationWsGateway = class StreamConversationWsGateway {
    constructor(socketUserService, authService, conversationService, userService, performerService, requestService, streamModel) {
        this.socketUserService = socketUserService;
        this.authService = authService;
        this.conversationService = conversationService;
        this.userService = userService;
        this.performerService = performerService;
        this.requestService = requestService;
        this.streamModel = streamModel;
    }
    async handleJoinPrivateRoom(client, payload) {
        try {
            const { conversationId } = payload;
            const { token } = client.handshake.query;
            if (!token) {
                return;
            }
            const [user, conversation] = await Promise.all([
                this.authService.getSourceFromJWT(token),
                this.conversationService.findById(conversationId)
            ]);
            if (!user || !conversation) {
                return;
            }
            const stream = await this.streamModel.findOne({
                _id: conversation.streamId
            });
            if (!stream)
                return;
            const roomName = this.conversationService.serializeConversation(conversationId, conversation.type);
            client.join(roomName);
            await this.socketUserService.emitToRoom(roomName, `message_created_conversation_${conversation._id}`, {
                text: `${user.username} has joined this conversation`,
                _id: string_helper_1.generateUuid(),
                conversationId: conversation._id,
                isSystem: true
            });
            if (user.isPerformer && `${user._id}` === `${conversation.performerId}`) {
                await this.socketUserService.emitToRoom(roomName, MODEL_JOIN_ROOM, {
                    conversationId
                });
                const type = conversation.type.split('_');
                await this.performerService.setStreamingStatus(user._id, type[1]);
            }
            const connections = await this.socketUserService.getRoomUserConnections(roomName);
            const memberIds = [];
            Object.keys(connections).forEach(id => {
                const value = connections[id].split(',');
                if (value[0] === 'member') {
                    memberIds.push(id);
                }
            });
            const members = await this.userService.findByIds(memberIds);
            const streamId = `${stream.type}-${stream._id}-${user._id}`;
            const data = Object.assign(Object.assign({}, constant_1.defaultStreamValue), { streamId, name: streamId, description: '', type: constant_1.BroadcastType.LiveStream, status: 'finished' });
            const result = await this.requestService.create(data);
            if (result.status) {
                throw result.error || result.data;
            }
            await this.socketUserService.emitToUsers(user._id, JOINED_THE_ROOM, {
                streamId,
                conversationId,
                total: client.adapter.rooms[roomName]
                    ? client.adapter.rooms[roomName].length
                    : 0,
                members: members.map(m => new dtos_1.UserDto(m).toResponse()),
                streamList: stream.streamIds
            });
        }
        catch (err) {
            console.log(err);
        }
    }
    async handleReJoinPrivateRoom(client, payload) {
        try {
            const { conversationId } = payload;
            const { token } = client.handshake.query;
            if (!token) {
                return;
            }
            const [decodeded, conversation] = await Promise.all([
                this.authService.verifyJWT(token),
                this.conversationService.findById(conversationId)
            ]);
            if (!conversation) {
                return;
            }
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
            const stream = await this.streamModel.findOne({
                _id: conversation.streamId
            });
            if (!stream)
                return;
            const roomName = this.conversationService.serializeConversation(conversationId, conversation.type);
            if (!client.rooms[roomName]) {
                client.join(roomName);
            }
            const connection = await this.socketUserService.getConnectionValue(roomName, user._id);
            if (!connection) {
                this.socketUserService.addConnectionToRoom(roomName, user._id, authUser.source === 'performer' ? 'model' : 'member');
            }
            await this.socketUserService.emitToRoom(roomName, `message_created_conversation_${conversation._id}`, {
                text: `${user.username} has joined this conversation`,
                _id: string_helper_1.generateUuid(),
                conversationId: conversation._id,
                isSystem: true
            });
            if (user.isPerformer && `${user._id}` === `${conversation.performerId}`) {
                await this.socketUserService.emitToRoom(roomName, MODEL_JOIN_ROOM, {
                    conversationId
                });
                const type = conversation.type.split('_');
                await this.performerService.setStreamingStatus(user._id, type[1]);
            }
            const connections = await this.socketUserService.getRoomUserConnections(roomName);
            const memberIds = [];
            Object.keys(connections).forEach(id => {
                const value = connections[id].split(',');
                if (value[0] === 'member') {
                    memberIds.push(id);
                }
            });
            const members = await this.userService.findByIds(memberIds);
            await this.socketUserService.emitToUsers(user._id, JOINED_THE_ROOM, {
                conversationId,
                total: client.adapter.rooms[roomName]
                    ? client.adapter.rooms[roomName].length
                    : 0,
                members: members.map(m => new dtos_1.UserDto(m).toResponse()),
                streamList: stream.streamIds
            });
        }
        catch (err) {
            console.log(err);
        }
    }
    async handleLeavePrivateRoom(client, payload) {
        try {
            const { conversationId } = payload;
            const { token } = client.handshake.query;
            if (!token) {
                return;
            }
            const [user, conversation] = await Promise.all([
                this.authService.getSourceFromJWT(token),
                this.conversationService.findById(payload.conversationId)
            ]);
            if (!user || !conversation) {
                return;
            }
            const stream = await this.streamModel.findOne({
                _id: conversation.streamId
            });
            if (!stream)
                return;
            const roomName = this.conversationService.serializeConversation(conversationId, conversation.type);
            client.leave(roomName);
            await this.socketUserService.emitToRoom(roomName, `message_created_conversation_${payload.conversationId}`, {
                text: `${user.username} has left this conversation`,
                _id: string_helper_1.generateUuid(),
                conversationId: payload.conversationId,
                isSystem: true
            });
            if (user.isPerformer && `${user._id}` === `${conversation.performerId}`) {
                await Promise.all([
                    this.socketUserService.emitToRoom(roomName, MODEL_LEFT_ROOM, {
                        date: new Date(),
                        conversationId
                    }),
                    this.performerService.setStreamingStatus(user._id, constant_1.OFFLINE)
                ]);
            }
            if (stream.isStreaming &&
                (!client.adapter.rooms[roomName] || stream.type === constant_1.PRIVATE_CHAT)) {
                stream.isStreaming = false;
                stream.lastStreamingTime = new Date();
                await stream.save();
            }
        }
        catch (error) {
            console.log(error);
        }
    }
};
__decorate([
    websockets_1.SubscribeMessage(JOIN_ROOM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StreamConversationWsGateway.prototype, "handleJoinPrivateRoom", null);
__decorate([
    websockets_1.SubscribeMessage(REJOIN_ROOM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StreamConversationWsGateway.prototype, "handleReJoinPrivateRoom", null);
__decorate([
    websockets_1.SubscribeMessage(LEAVE_ROOM),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StreamConversationWsGateway.prototype, "handleLeavePrivateRoom", null);
StreamConversationWsGateway = __decorate([
    websockets_1.WebSocketGateway(),
    __param(1, common_1.Inject(common_1.forwardRef(() => services_2.AuthService))),
    __param(6, common_1.Inject(stream_provider_1.STREAM_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [socket_user_service_1.SocketUserService,
        services_2.AuthService,
        services_3.ConversationService,
        services_4.UserService,
        services_5.PerformerService,
        services_1.RequestService,
        mongoose_1.Model])
], StreamConversationWsGateway);
exports.StreamConversationWsGateway = StreamConversationWsGateway;
//# sourceMappingURL=conversation.gateway.js.map