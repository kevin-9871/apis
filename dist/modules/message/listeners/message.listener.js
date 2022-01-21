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
exports.MessageListener = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const mongoose_1 = require("mongoose");
const socket_user_service_1 = require("../../socket/services/socket-user.service");
const constants_1 = require("../constants");
const providers_1 = require("../providers");
const MESSAGE_NOTIFY = 'MESSAGE_NOTIFY';
let MessageListener = class MessageListener {
    constructor(queueEventService, socketUserService, conversationModel, NotificationMessageModel) {
        this.queueEventService = queueEventService;
        this.socketUserService = socketUserService;
        this.conversationModel = conversationModel;
        this.NotificationMessageModel = NotificationMessageModel;
        this.queueEventService.subscribe(constants_1.MESSAGE_CHANNEL, MESSAGE_NOTIFY, this.handleMessage.bind(this));
    }
    async handleMessage(event) {
        if (event.eventName !== constants_1.MESSAGE_EVENT.CREATED)
            return;
        const message = event.data;
        const conversation = await this.conversationModel
            .findOne({ _id: message.conversationId })
            .lean()
            .exec();
        if (![constants_1.CONVERSATION_TYPE.PRIVATE, constants_1.CONVERSATION_TYPE.GROUP].includes(conversation.type))
            return;
        const receiverIds = (conversation.recipients || [])
            .map(r => r.sourceId)
            .filter(r => r.toString() !== message.senderId.toString());
        await this.updateNotification(conversation, receiverIds, 1);
        await this.handleNotify(receiverIds, message);
        await this.updateLastMessage(conversation, message);
    }
    async updateLastMessage(conversation, message) {
        const lastMessage = kernel_1.StringHelper.truncate(message.text || '', 30);
        const lastSenderId = message.senderId;
        const lastMessageCreatedAt = message.createdAt;
        await this.conversationModel.updateOne({ _id: conversation._id }, {
            $set: {
                lastMessage,
                lastSenderId,
                lastMessageCreatedAt
            }
        }, { upsert: false });
    }
    async updateNotification(conversation, receiverIds, num = 1) {
        const availableData = await this.NotificationMessageModel.find({
            conversationId: conversation._id,
            recipientId: { $in: receiverIds }
        });
        if (availableData && availableData.length) {
            const ids = availableData.map(a => a._id);
            await this.NotificationMessageModel.updateMany({ _id: { $in: ids } }, {
                $inc: { totalNotReadMessage: num },
                updatedAt: new Date()
            }, { upsert: true });
            receiverIds &&
                receiverIds.forEach(async (receiverId) => {
                    const totalNotReadMessage = await this.NotificationMessageModel.aggregate([
                        {
                            $match: { recipientId: receiverId }
                        },
                        {
                            $group: {
                                _id: '$conversationId',
                                total: {
                                    $sum: '$totalNotReadMessage'
                                }
                            }
                        }
                    ]);
                    let total = 0;
                    totalNotReadMessage &&
                        totalNotReadMessage.length &&
                        totalNotReadMessage.forEach(data => {
                            if (data.total) {
                                total += data.total;
                            }
                        });
                    await this.notifyCountingNotReadMessageInConversation(receiverId, total);
                });
            return;
        }
        receiverIds.forEach(async (rId) => {
            await new this.NotificationMessageModel({
                conversationId: conversation._id,
                recipientId: rId,
                totalNotReadMessage: num,
                updatedAt: new Date(),
                createdAt: new Date()
            }).save();
            const totalNotReadMessage = await this.NotificationMessageModel.aggregate([
                {
                    $match: { recipientId: rId }
                },
                {
                    $group: {
                        _id: '$conversationId',
                        total: {
                            $sum: '$totalNotReadMessage'
                        }
                    }
                }
            ]);
            let total = 0;
            totalNotReadMessage &&
                totalNotReadMessage.length &&
                totalNotReadMessage.forEach(data => {
                    if (data.total) {
                        total += data.total;
                    }
                });
            await this.notifyCountingNotReadMessageInConversation(rId, total);
        });
    }
    async notifyCountingNotReadMessageInConversation(receiverId, total) {
        await this.socketUserService.emitToUsers([receiverId], 'nofify_read_messages_in_conversation', { total });
    }
    async handleNotify(receiverIds, message) {
        await this.socketUserService.emitToUsers(receiverIds, 'message_created', message);
    }
};
MessageListener = __decorate([
    common_1.Injectable(),
    __param(2, common_1.Inject(providers_1.CONVERSATION_MODEL_PROVIDER)),
    __param(3, common_1.Inject(providers_1.NOTIFICATION_MESSAGE_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [kernel_1.QueueEventService,
        socket_user_service_1.SocketUserService,
        mongoose_1.Model,
        mongoose_1.Model])
], MessageListener);
exports.MessageListener = MessageListener;
//# sourceMappingURL=message.listener.js.map