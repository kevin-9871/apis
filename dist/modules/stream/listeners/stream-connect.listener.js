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
exports.StreamConnectListener = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const mongoose_1 = require("mongoose");
const socket_user_service_1 = require("../../socket/services/socket-user.service");
const constant_1 = require("../constant");
const services_1 = require("../../user/services");
const services_2 = require("../../performer/services");
const services_3 = require("../../message/services");
const string_helper_1 = require("../../../kernel/helpers/string.helper");
const stream_provider_1 = require("../providers/stream.provider");
const services_4 = require("../services");
const USER_LIVE_STREAM_DISCONNECTED = 'USER_LIVE_STREAM_CONNECTED';
const MODEL_LIVE_STREAM_DISCONNECTED = 'MODEL_LIVE_STREAM_CONNECTED';
const USER_LEFT_ROOM = 'USER_LEFT_ROOM';
let StreamConnectListener = class StreamConnectListener {
    constructor(queueEventService, userService, performerService, socketUserService, streamService, conversationService, streamModel) {
        this.queueEventService = queueEventService;
        this.userService = userService;
        this.performerService = performerService;
        this.socketUserService = socketUserService;
        this.streamService = streamService;
        this.conversationService = conversationService;
        this.streamModel = streamModel;
        this.queueEventService.subscribe(constant_1.USER_LIVE_STREAM_CHANNEL, USER_LIVE_STREAM_DISCONNECTED, this.userDisconnectHandler.bind(this));
        this.queueEventService.subscribe(constant_1.PERFORMER_LIVE_STREAM_CHANNEL, MODEL_LIVE_STREAM_DISCONNECTED, this.modelDisconnectHandler.bind(this));
    }
    leftRoom(conversation, username, isMember = true) {
        const { _id, type } = conversation;
        const roomName = this.conversationService.serializeConversation(_id, type);
        return Promise.all([
            this.socketUserService.emitToRoom(roomName, `message_created_conversation_${_id}`, {
                _id: string_helper_1.generateUuid(),
                text: `${username} has left this conversation`,
                conversationId: _id,
                isSystem: true
            }),
            isMember && this.socketUserService.emitToRoom(roomName, USER_LEFT_ROOM, {
                username,
                conversationId: _id
            })
        ]);
    }
    async userDisconnectHandler(event) {
        if (event.eventName !== constant_1.LIVE_STREAM_EVENT_NAME.DISCONNECTED) {
            return;
        }
        const sourceId = event.data;
        const user = await this.userService.findById(sourceId);
        if (!user) {
            return;
        }
        const connectedRedisRooms = await this.socketUserService.userGetAllConnectedRooms(sourceId);
        if (!connectedRedisRooms.length) {
            return;
        }
        await Promise.all(connectedRedisRooms.map(id => this.socketUserService.removeConnectionFromRoom(id, sourceId)));
        const conversationIds = connectedRedisRooms.map(id => this.conversationService.deserializeConversationId(id));
        const conversations = await this.conversationService.findByIds(conversationIds);
        if (conversations.length) {
            await Promise.all(conversations.map(conversation => this.leftRoom(conversation, user.username)));
        }
    }
    async modelDisconnectHandler(event) {
        if (event.eventName !== constant_1.LIVE_STREAM_EVENT_NAME.DISCONNECTED) {
            return;
        }
        const sourceId = event.data;
        const model = await this.performerService.findById(sourceId);
        if (!model) {
            return;
        }
        const connectedRedisRooms = await this.socketUserService.userGetAllConnectedRooms(sourceId);
        if (!connectedRedisRooms.length) {
            return;
        }
        await Promise.all(connectedRedisRooms.map(r => this.socketUserService.removeConnectionFromRoom(r, sourceId)));
        const conversationIds = connectedRedisRooms.map(id => this.conversationService.deserializeConversationId(id));
        const conversations = await this.conversationService.findByIds(conversationIds);
        if (conversations.length) {
            await Promise.all(conversations.map(conversation => this.leftRoom(conversation, model.username, false)));
        }
        await this.streamModel.updateMany({ isStreaming: true }, { $set: { isStreaming: false, lastStreamingTime: new Date() } });
    }
};
StreamConnectListener = __decorate([
    common_1.Injectable(),
    __param(6, common_1.Inject(stream_provider_1.STREAM_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [kernel_1.QueueEventService,
        services_1.UserService,
        services_2.PerformerService,
        socket_user_service_1.SocketUserService,
        services_4.StreamService,
        services_3.ConversationService,
        mongoose_1.Model])
], StreamConnectListener);
exports.StreamConnectListener = StreamConnectListener;
//# sourceMappingURL=stream-connect.listener.js.map