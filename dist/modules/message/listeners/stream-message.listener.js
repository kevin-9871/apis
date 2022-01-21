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
exports.StreamMessageListener = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const constants_1 = require("../../../kernel/constants");
const constants_2 = require("../../performer/constants");
const services_1 = require("../../performer/services");
const socket_user_service_1 = require("../../socket/services/socket-user.service");
const constant_1 = require("../../stream/constant");
const dtos_1 = require("../../stream/dtos");
const services_2 = require("../../stream/services");
const uuid_1 = require("uuid");
const constants_3 = require("../constants");
const services_3 = require("../services");
const MESSAGE_STREAM_NOTIFY = 'MESSAGE_STREAM_NOTIFY';
const CONVERSATION_INITIALIZE = 'CONVERSATION_INITIALIZE';
let StreamMessageListener = class StreamMessageListener {
    constructor(queueEventService, socketUserService, conversationService, performerService, streamService) {
        this.queueEventService = queueEventService;
        this.socketUserService = socketUserService;
        this.conversationService = conversationService;
        this.performerService = performerService;
        this.streamService = streamService;
        this.logger = new common_1.Logger();
        this.queueEventService.subscribe(constants_3.MESSAGE_PRIVATE_STREAM_CHANNEL, MESSAGE_STREAM_NOTIFY, this.handleMessage.bind(this));
        this.queueEventService.subscribe(constants_2.PERFORMER_CHANNEL, CONVERSATION_INITIALIZE, this.handleConversation.bind(this));
    }
    async handleMessage(event) {
        if (![constants_3.MESSAGE_EVENT.CREATED, constants_3.MESSAGE_EVENT.DELETED].includes(event.eventName))
            return;
        const message = event.data;
        const conversation = await this.conversationService.findById(message.conversationId);
        if (!(conversation === null || conversation === void 0 ? void 0 : conversation.type.includes('stream_')))
            return;
        if (event.eventName === constants_3.MESSAGE_EVENT.CREATED) {
            await this.handleNotify(conversation, message);
        }
        if (event.eventName === constants_3.MESSAGE_EVENT.DELETED) {
            await this.handleNotifyDelete(conversation, message);
        }
    }
    async handleNotify(conversation, message) {
        const roomName = this.conversationService.serializeConversation(conversation._id, conversation.type);
        await this.socketUserService.emitToRoom(roomName, `message_created_conversation_${conversation._id}`, message);
    }
    async handleNotifyDelete(conversation, message) {
        const roomName = this.conversationService.serializeConversation(conversation._id, conversation.type);
        await this.socketUserService.emitToRoom(roomName, `message_deleted_conversation_${conversation._id}`, message);
    }
    async handleConversation(event) {
        try {
            const { eventName, data } = event;
            if (eventName !== constants_1.EVENT.CREATED) {
                return;
            }
            const performer = await this.performerService.findById(data.id);
            if (!performer) {
                return;
            }
            const stream = await this.streamService.create({
                sessionId: uuid_1.v4(),
                performerId: performer._id,
                type: constant_1.PUBLIC_CHAT
            });
            await this.conversationService.createStreamConversation(new dtos_1.StreamDto(stream));
        }
        catch (e) {
            this.logger.error(e);
        }
    }
};
StreamMessageListener = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [kernel_1.QueueEventService,
        socket_user_service_1.SocketUserService,
        services_3.ConversationService,
        services_1.PerformerService,
        services_2.StreamService])
], StreamMessageListener);
exports.StreamMessageListener = StreamMessageListener;
//# sourceMappingURL=stream-message.listener.js.map