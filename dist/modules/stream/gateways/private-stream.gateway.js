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
exports.PrivateStreamWsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const socket_user_service_1 = require("../../socket/services/socket-user.service");
const services_1 = require("../../auth/services");
const mongoose_1 = require("mongoose");
const services_2 = require("../../user/services");
const dtos_1 = require("../../user/dtos");
const services_3 = require("../../performer/services");
const moment = require("moment");
const services_4 = require("../../message/services");
const constant_1 = require("../constant");
const stream_provider_1 = require("../providers/stream.provider");
const services_5 = require("../services");
const STREAM_JOINED = 'private-stream/streamJoined';
const STREAM_LEAVED = 'private-stream/streamLeaved';
const STREAM_INFORMATION_CHANGED = 'private-stream/streamInformationChanged';
let PrivateStreamWsGateway = class PrivateStreamWsGateway {
    constructor(socketUserService, streamModel, authService, userService, performerService, requestService, conversationService) {
        this.socketUserService = socketUserService;
        this.streamModel = streamModel;
        this.authService = authService;
        this.userService = userService;
        this.performerService = performerService;
        this.requestService = requestService;
        this.conversationService = conversationService;
    }
    async handleJoinStream(client, payload) {
        try {
            const { conversationId, streamId } = payload;
            if (!conversationId) {
                return;
            }
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
            await this.streamModel.updateOne({ _id: conversation.streamId }, {
                $addToSet: {
                    streamIds: streamId
                }
            });
            const resp = await this.requestService.getBroadcast(streamId);
            if (resp.status) {
                throw resp.error || resp.data;
            }
            if ([constant_1.BroadcastStatus.CREATED, constant_1.BroadcastStatus.BROADCASTING].includes(resp.data.status)) {
                const roomName = this.conversationService.serializeConversation(conversationId, conversation.type);
                await this.socketUserService.emitToRoom(roomName, STREAM_JOINED, {
                    streamId,
                    conversationId
                });
                if (!user.isPerformer && conversation.type === 'stream_private') {
                    await this.socketUserService.emitToUsers(conversation.performerId, 'private-chat-request', {
                        user: user.toPrivateRequestResponse(),
                        conversationId,
                        streamId: conversation.streamId,
                        id: streamId
                    });
                }
                await this.socketUserService.addConnectionToRoom(roomName, user._id, user.isPerformer ? 'model' : 'member');
                const connections = await this.socketUserService.getRoomUserConnections(roomName);
                const memberIds = [];
                Object.keys(connections).forEach(id => {
                    const value = connections[id].split(',');
                    if (value[0] === 'member') {
                        memberIds.push(id);
                    }
                });
                if (memberIds.length) {
                    const members = await this.userService.findByIds(memberIds);
                    const data = {
                        conversationId,
                        total: members.length,
                        members: members.map(m => new dtos_1.UserDto(m).toResponse())
                    };
                    this.socketUserService.emitToRoom(roomName, STREAM_INFORMATION_CHANGED, data);
                }
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    async handleLeaveStream(client, payload) {
        try {
            const { conversationId, streamId } = payload;
            if (!conversationId) {
                return;
            }
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
            await this.streamModel.updateOne({ _id: conversation.streamId }, {
                $pull: {
                    streamIds: streamId
                }
            });
            const roomName = this.conversationService.serializeConversation(conversationId, conversation.type);
            await this.socketUserService.emitToRoom(roomName, STREAM_LEAVED, {
                streamId,
                conversationId
            });
            const results = await this.socketUserService.getConnectionValue(roomName, user._id);
            if (results) {
                const values = results.split(',');
                const timeJoined = values[1] ? parseInt(values[1], 10) : null;
                const role = values[0];
                if (timeJoined) {
                    const streamTime = moment()
                        .toDate()
                        .getTime() - timeJoined;
                    if (role === 'model' &&
                        `${user._id}` === `${conversation.performerId}`) {
                        await this.performerService.updateLastStreamingTime(user._id, streamTime);
                    }
                    else if (role === 'member') {
                        await this.userService.updateStats(user._id, {
                            'stats.totalViewTime': streamTime
                        });
                    }
                }
            }
            await this.socketUserService.removeConnectionFromRoom(roomName, user._id);
            const connections = await this.socketUserService.getRoomUserConnections(roomName);
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
                conversationId,
                total: members.length,
                members: members.map(m => new dtos_1.UserDto(m).toResponse())
            };
            this.socketUserService.emitToRoom(roomName, STREAM_INFORMATION_CHANGED, data);
        }
        catch (e) {
            console.log(e);
        }
    }
};
__decorate([
    websockets_1.SubscribeMessage('private-stream/join'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PrivateStreamWsGateway.prototype, "handleJoinStream", null);
__decorate([
    websockets_1.SubscribeMessage('private-stream/leave'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PrivateStreamWsGateway.prototype, "handleLeaveStream", null);
PrivateStreamWsGateway = __decorate([
    websockets_1.WebSocketGateway(),
    __param(1, common_1.Inject(stream_provider_1.STREAM_MODEL_PROVIDER)),
    __param(2, common_1.Inject(common_1.forwardRef(() => services_1.AuthService))),
    __metadata("design:paramtypes", [socket_user_service_1.SocketUserService,
        mongoose_1.Model,
        services_1.AuthService,
        services_2.UserService,
        services_3.PerformerService,
        services_5.RequestService,
        services_4.ConversationService])
], PrivateStreamWsGateway);
exports.PrivateStreamWsGateway = PrivateStreamWsGateway;
//# sourceMappingURL=private-stream.gateway.js.map