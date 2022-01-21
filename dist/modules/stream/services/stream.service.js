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
exports.StreamService = void 0;
const common_1 = require("@nestjs/common");
const services_1 = require("../../performer/services");
const mongoose_1 = require("mongoose");
const mongodb_1 = require("mongodb");
const kernel_1 = require("../../../kernel");
const uuid_1 = require("uuid");
const services_2 = require("../../message/services");
const queue_1 = require("../../../kernel/infras/queue");
const dtos_1 = require("../../user/dtos");
const request_service_1 = require("./request.service");
const socket_user_service_1 = require("../../socket/services/socket-user.service");
const constant_1 = require("../constant");
const dtos_2 = require("../dtos");
const stream_provider_1 = require("../providers/stream.provider");
const exceptions_1 = require("../exceptions");
const token_not_enough_1 = require("../exceptions/token-not-enough");
let StreamService = class StreamService {
    constructor(performerService, streamModel, conversationService, socketUserService, requestService, queueEventService) {
        this.performerService = performerService;
        this.streamModel = streamModel;
        this.conversationService = conversationService;
        this.socketUserService = socketUserService;
        this.requestService = requestService;
        this.queueEventService = queueEventService;
    }
    async findById(id) {
        const stream = await this.streamModel.findOne({ _id: id });
        if (!stream) {
            throw new kernel_1.EntityNotFoundException();
        }
        return stream;
    }
    async findBySessionId(sessionId) {
        const stream = await this.streamModel.findOne({ sessionId });
        if (!stream) {
            throw new kernel_1.EntityNotFoundException();
        }
        return stream;
    }
    async findByPerformerId(performerId, payload) {
        const stream = await this.streamModel.findOne(Object.assign({ performerId }, payload));
        return stream;
    }
    async getSessionId(performerId, type) {
        let stream = await this.streamModel.findOne({ performerId, type });
        if (!stream) {
            const data = {
                sessionId: uuid_1.v4(),
                performerId,
                type
            };
            stream = await this.streamModel.create(data);
        }
        return stream.sessionId;
    }
    async create(payload) {
        return this.streamModel.create(payload);
    }
    async goLive(performerId) {
        var _a, _b, _c;
        let stream = await this.streamModel.findOne({
            performerId,
            type: constant_1.PUBLIC_CHAT
        });
        if (!stream) {
            const data = {
                sessionId: uuid_1.v4(),
                performerId,
                type: constant_1.PUBLIC_CHAT
            };
            stream = await this.streamModel.create(data);
        }
        let conversation = await this.conversationService.findOne({
            type: 'stream_public',
            performerId
        });
        if (!conversation) {
            conversation = await this.conversationService.createStreamConversation(new dtos_2.StreamDto(stream));
        }
        const data = Object.assign(Object.assign({}, constant_1.defaultStreamValue), { streamId: stream._id, name: stream._id, description: '', type: constant_1.BroadcastType.LiveStream, status: 'finished' });
        const result = await this.requestService.create(data);
        if (result.status) {
            throw new exceptions_1.StreamServerErrorException({
                message: (_b = (_a = result.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message,
                error: result.data,
                status: (_c = result.data) === null || _c === void 0 ? void 0 : _c.status
            });
        }
        return { conversation, sessionId: stream._id };
    }
    async joinPublicChat(performerId) {
        const stream = await this.streamModel.findOne({
            performerId,
            type: constant_1.PUBLIC_CHAT
        });
        if (!stream) {
            throw new kernel_1.EntityNotFoundException();
        }
        if (!stream.isStreaming) {
            throw new exceptions_1.StreamOfflineException();
        }
        return { sessionId: stream._id };
    }
    async requestPrivateChat(user, performerId) {
        const performer = await this.performerService.findById(performerId);
        if (!performer) {
            throw new kernel_1.EntityNotFoundException();
        }
        if (user.balance < performer.privateCallPrice) {
            throw new token_not_enough_1.TokenNotEnoughException();
        }
        const data = {
            sessionId: uuid_1.v4(),
            performerId,
            userIds: [user._id],
            type: constant_1.PRIVATE_CHAT,
            isStreaming: true
        };
        const stream = await this.streamModel.create(data);
        const recipients = [
            { source: 'performer', sourceId: new mongodb_1.ObjectId(performerId) },
            { source: 'user', sourceId: user._id }
        ];
        const conversation = await this.conversationService.createStreamConversation(new dtos_2.StreamDto(stream), recipients);
        return { conversation, sessionId: stream.sessionId };
    }
    async accpetPrivateChat(id, performerId) {
        const conversation = await this.conversationService.findById(id);
        if (!conversation) {
            throw new kernel_1.EntityNotFoundException();
        }
        const recipent = conversation.recipients.find(r => r.sourceId.toString() === performerId.toString() &&
            r.source === 'performer');
        if (!recipent) {
            throw new common_1.ForbiddenException();
        }
        const stream = await this.findById(conversation.streamId);
        if (!stream && stream.performerId !== performerId) {
            throw new kernel_1.EntityNotFoundException();
        }
        if (!stream.isStreaming) {
            throw new exceptions_1.StreamOfflineException();
        }
        return { conversation, sessionId: stream.sessionId };
    }
    async startGroupChat(performerId) {
        const groupChatRooms = await this.streamModel.find({
            performerId,
            type: constant_1.GROUP_CHAT,
            isStreaming: true
        });
        if (groupChatRooms.length) {
            Promise.all(groupChatRooms.map(stream => {
                stream.set('isStreaming', false);
                return stream.save();
            }));
        }
        const data = {
            sessionId: uuid_1.v4(),
            performerId,
            userIds: [],
            type: constant_1.GROUP_CHAT,
            isStreaming: true
        };
        const stream = await this.streamModel.create(data);
        const recipients = [{ source: 'performer', sourceId: performerId }];
        const conversation = await this.conversationService.createStreamConversation(new dtos_2.StreamDto(stream), recipients);
        return { conversation, sessionId: stream.sessionId };
    }
    async joinGroupChat(performerId, user) {
        const performer = await this.performerService.findById(performerId);
        if (!performer) {
            throw new kernel_1.EntityNotFoundException();
        }
        if (user.balance < performer.groupCallPrice) {
            throw new token_not_enough_1.TokenNotEnoughException();
        }
        const stream = await this.streamModel.findOne({
            performerId,
            type: constant_1.GROUP_CHAT,
            isStreaming: true
        });
        if (!stream || (stream && !stream.isStreaming)) {
            throw new exceptions_1.StreamOfflineException();
        }
        const conversation = await this.conversationService.findOne({
            streamId: stream._id
        });
        if (!conversation) {
            throw new kernel_1.EntityNotFoundException();
        }
        const numberOfParticipant = conversation.recipients.length - 1;
        const { maxParticipantsAllowed } = performer;
        if (maxParticipantsAllowed &&
            numberOfParticipant > maxParticipantsAllowed) {
            throw new exceptions_1.ParticipantJoinLimitException();
        }
        const joinedTheRoom = conversation.recipients.find(recipient => recipient.sourceId.toString() === user._id.toString());
        if (!joinedTheRoom) {
            const recipient = {
                source: 'user',
                sourceId: user._id
            };
            await this.conversationService.addRecipient(conversation._id, recipient);
        }
        return { conversation, sessionId: stream.sessionId };
    }
    async webhook(sessionId, payload) {
        const stream = await this.streamModel.findOne({ sessionId });
        if (!stream) {
            return;
        }
        switch (payload.action) {
            case 'liveStreamStarted':
                if (stream.type === constant_1.PUBLIC_CHAT)
                    stream.isStreaming = true;
                break;
            case 'liveStreamEnded':
                if (stream.type === constant_1.PUBLIC_CHAT) {
                    stream.isStreaming = false;
                    stream.lastStreamingTime = new Date();
                }
                break;
            default:
                break;
        }
        await stream.save();
    }
    async getOneTimeToken(payload, userId) {
        const { id } = payload;
        let streamId = id;
        if (id.indexOf(constant_1.PRIVATE_CHAT) === 0 || id.indexOf('group') === 0) {
            [, streamId] = id.split('-');
        }
        const [stream, conversation] = await Promise.all([
            this.streamModel.findOne({ _id: streamId }),
            this.conversationService.findOne({ streamId })
        ]);
        if (!stream || !conversation) {
            throw new kernel_1.EntityNotFoundException();
        }
        const roomId = this.conversationService.serializeConversation(conversation._id, conversation.type);
        const connections = await this.socketUserService.getRoomUserConnections(roomId);
        const memberIds = [];
        Object.keys(connections).forEach(v => {
            memberIds.push(v);
        });
        if (!memberIds.includes(userId)) {
            throw new common_1.ForbiddenException();
        }
        const resp = await this.requestService.generateOneTimeToken(id, payload);
        return resp.data;
    }
};
StreamService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(common_1.forwardRef(() => services_1.PerformerService))),
    __param(1, common_1.Inject(stream_provider_1.STREAM_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [services_1.PerformerService,
        mongoose_1.Model,
        services_2.ConversationService,
        socket_user_service_1.SocketUserService,
        request_service_1.RequestService,
        queue_1.QueueEventService])
], StreamService);
exports.StreamService = StreamService;
//# sourceMappingURL=stream.service.js.map