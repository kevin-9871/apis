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
exports.MessageService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const dtos_1 = require("../../user/dtos");
const file_1 = require("../../file");
const services_1 = require("../../file/services");
const services_2 = require("../../user/services");
const services_3 = require("../../performer/services");
const services_4 = require("../../favourite/services");
const dtos_2 = require("../../performer/dtos");
const message_provider_1 = require("../providers/message.provider");
const constants_1 = require("../constants");
const dtos_3 = require("../dtos");
const conversation_service_1 = require("./conversation.service");
let MessageService = class MessageService {
    constructor(performerService, conversationService, messageModel, queueEventService, fileService, userService, favouriteService, performerBlockSettingService) {
        this.performerService = performerService;
        this.conversationService = conversationService;
        this.messageModel = messageModel;
        this.queueEventService = queueEventService;
        this.fileService = fileService;
        this.userService = userService;
        this.favouriteService = favouriteService;
        this.performerBlockSettingService = performerBlockSettingService;
    }
    async createStreamMessageFromConversation(conversationId, payload, sender, req) {
        const conversation = await this.conversationService.findById(conversationId);
        if (!conversation) {
            throw new kernel_1.EntityNotFoundException();
        }
        const found = conversation.recipients.find(recipient => recipient.sourceId.toString() === sender.sourceId.toString());
        if (!found) {
            throw new kernel_1.EntityNotFoundException();
        }
        if (sender.source === 'user') {
            const { performerId } = conversation;
            const blocked = await this.performerBlockSettingService.checkBlockByPerformerId(performerId, sender.sourceId, req);
            if (blocked) {
                throw new common_1.ForbiddenException();
            }
        }
        const message = await this.messageModel.create(Object.assign(Object.assign({}, payload), { senderId: sender.sourceId, senderSource: sender.source, conversationId: conversation._id }));
        await message.save();
        const dto = new dtos_3.MessageDto(message);
        await this.queueEventService.publish({
            channel: constants_1.MESSAGE_PRIVATE_STREAM_CHANNEL,
            eventName: constants_1.MESSAGE_EVENT.CREATED,
            data: dto
        });
        return dto;
    }
    async createPublicStreamMessageFromConversation(conversationId, payload, sender, user, req) {
        const conversation = await this.conversationService.findById(conversationId);
        if (!conversation) {
            throw new kernel_1.EntityNotFoundException();
        }
        if (sender.source === 'user') {
            const { performerId } = conversation;
            const blocked = await this.performerBlockSettingService.checkBlockByPerformerId(performerId, sender.sourceId, req);
            if (blocked) {
                throw new common_1.ForbiddenException();
            }
        }
        const message = await this.messageModel.create(Object.assign(Object.assign({}, payload), { senderId: sender.sourceId, senderSource: sender.source, conversationId: conversation._id }));
        await message.save();
        const dto = new dtos_3.MessageDto(message);
        dto.senderInfo = user.toResponse();
        await this.queueEventService.publish({
            channel: constants_1.MESSAGE_PRIVATE_STREAM_CHANNEL,
            eventName: constants_1.MESSAGE_EVENT.CREATED,
            data: dto
        });
        return dto;
    }
    async createPrivateFileMessage(sender, recipient, file, payload, req) {
        const conversation = await this.conversationService.createPrivateConversation(sender, recipient);
        if (!file)
            throw new Error('File is valid!');
        if (!file.isImage()) {
            await this.fileService.removeIfNotHaveRef(file._id);
            throw new Error('Invalid image!');
        }
        if (sender.source === 'user') {
            const { performerId } = conversation;
            const blocked = await this.performerBlockSettingService.checkBlockByPerformerId(performerId, sender.sourceId, req);
            if (blocked) {
                throw new common_1.ForbiddenException();
            }
        }
        const message = await this.messageModel.create(Object.assign(Object.assign({}, payload), { type: 'photo', senderId: sender.sourceId, fileId: file._id, senderSource: sender.source, conversationId: conversation._id }));
        await message.save();
        const dto = new dtos_3.MessageDto(message);
        dto.imageUrl = file.getUrl();
        await this.queueEventService.publish({
            channel: constants_1.MESSAGE_CHANNEL,
            eventName: constants_1.MESSAGE_EVENT.CREATED,
            data: dto
        });
        return dto;
    }
    async loadMessages(req, user) {
        const conversation = await this.conversationService.findById(req.conversationId);
        if (!conversation) {
            throw new kernel_1.EntityNotFoundException();
        }
        const found = conversation.recipients.find(recipient => recipient.sourceId.toString() === user._id.toString());
        if (!found) {
            throw new kernel_1.EntityNotFoundException();
        }
        const query = { conversationId: conversation._id };
        const sort = {
            [req.sortBy || 'updatedAt']: req.sort
        };
        const [data, total] = await Promise.all([
            this.messageModel
                .find(query)
                .sort(sort)
                .lean()
                .limit(parseInt(req.limit, 10))
                .skip(parseInt(req.offset, 10)),
            this.messageModel.countDocuments(query)
        ]);
        const fileIds = data.map(d => d.fileId);
        const files = await this.fileService.findByIds(fileIds);
        const messages = data.map(message => {
            if (message.fileId) {
                const file = files.find(f => f._id.toString() === message.fileId.toString());
                return Object.assign(Object.assign({}, message), { imageUrl: file && file.getUrl() });
            }
            return Object.assign({}, message);
        });
        return {
            data: messages.map(m => new dtos_3.MessageDto(m)),
            total
        };
    }
    async loadPublicMessages(req) {
        const conversation = await this.conversationService.findById(req.conversationId);
        if (!conversation) {
            throw new kernel_1.EntityNotFoundException();
        }
        const sort = {
            [req.sortBy || 'updatedAt']: req.sort
        };
        const query = { conversationId: conversation._id };
        const [data, total] = await Promise.all([
            this.messageModel
                .find(query)
                .sort(sort)
                .lean()
                .limit(parseInt(req.limit, 10))
                .skip(parseInt(req.offset, 10)),
            this.messageModel.countDocuments(query)
        ]);
        const senderIds = data.map(d => d.senderId);
        const [users, performers] = await Promise.all([
            senderIds.length ? this.userService.findByIds(senderIds) : [],
            senderIds.length ? this.performerService.findByIds(senderIds) : []
        ]);
        const messages = data.map(message => {
            let user = null;
            user = users.find(u => u._id.toString() === message.senderId.toString());
            if (!user) {
                user = performers.find(p => p._id.toString() === message.senderId.toString());
            }
            return Object.assign(Object.assign({}, message), { senderInfo: user && user.roles && user.roles.includes('user')
                    ? new dtos_1.UserDto(user).toResponse()
                    : new dtos_2.PerformerDto(user).toResponse() });
        });
        return {
            data: messages.map(m => new dtos_3.MessageDto(m)),
            total
        };
    }
    async createPrivateMessageFromConversation(conversationId, payload, sender, req) {
        const conversation = await this.conversationService.findById(conversationId);
        if (!conversation) {
            throw new kernel_1.EntityNotFoundException();
        }
        const found = conversation.recipients.find(recipient => recipient.sourceId.toString() === sender.sourceId.toString());
        if (!found) {
            throw new kernel_1.EntityNotFoundException();
        }
        if (sender.source === 'user') {
            const { performerId } = conversation;
            const blocked = await this.performerBlockSettingService.checkBlockByPerformerId(performerId, sender.sourceId, req);
            if (blocked) {
                throw new common_1.ForbiddenException();
            }
        }
        const message = await this.messageModel.create(Object.assign(Object.assign({}, payload), { senderId: sender.sourceId, senderSource: sender.source, conversationId: conversation._id }));
        await message.save();
        const dto = new dtos_3.MessageDto(message);
        await this.queueEventService.publish({
            channel: constants_1.MESSAGE_CHANNEL,
            eventName: constants_1.MESSAGE_EVENT.CREATED,
            data: dto
        });
        return dto;
    }
    async sendMessageToAllFollowers(performerId, payload) {
        const followerIds = await this.favouriteService.getAllFollowerIdsByPerformerId(performerId);
        if (!followerIds.length) {
            return false;
        }
        const sender = {
            source: 'performer',
            sourceId: performerId
        };
        const conversations = await Promise.all(followerIds.map(id => this.conversationService.findOne({
            type: constants_1.CONVERSATION_TYPE.PRIVATE,
            recipients: {
                $all: [
                    {
                        source: 'user',
                        sourceId: id
                    },
                    sender
                ]
            }
        })));
        const newFolowerIds = followerIds.filter((_, index) => !conversations[index]);
        const newConversations = await Promise.all(newFolowerIds.map(id => this.conversationService.createPrivateConversation({ sourceId: performerId, source: 'performer' }, { sourceId: id, source: 'user' })));
        await Promise.all([...newConversations, ...conversations].map(conversation => conversation && this.createPrivateMessageFromConversation(conversation._id, payload, sender)));
        return true;
    }
    async deleteMessage(messageId, user) {
        const message = await this.messageModel.findById(messageId);
        if (!message) {
            throw new kernel_1.EntityNotFoundException();
        }
        if (user.roles &&
            !user.roles.includes('admin') &&
            message.senderId.toString() !== user._id.toString()) {
            throw new common_1.ForbiddenException();
        }
        await message.remove();
        await this.queueEventService.publish({
            channel: constants_1.MESSAGE_PRIVATE_STREAM_CHANNEL,
            eventName: constants_1.MESSAGE_EVENT.DELETED,
            data: new dtos_3.MessageDto(message)
        });
        return message;
    }
    async deleteAllMessageInConversation(conversationId, user) {
        const conversation = await this.conversationService.findById(conversationId);
        if (!conversation) {
            throw new kernel_1.EntityNotFoundException();
        }
        if (user.roles &&
            !user.roles.includes('admin') &&
            conversation.performerId.toString() !== user._id.toString()) {
            throw new common_1.ForbiddenException();
        }
        await this.messageModel.deleteMany({ conversationId: conversation._id });
        return { success: true };
    }
};
MessageService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(common_1.forwardRef(() => services_3.PerformerService))),
    __param(2, common_1.Inject(message_provider_1.MESSAGE_MODEL_PROVIDER)),
    __param(4, common_1.Inject(common_1.forwardRef(() => services_1.FileService))),
    __metadata("design:paramtypes", [services_3.PerformerService,
        conversation_service_1.ConversationService,
        mongoose_1.Model,
        kernel_1.QueueEventService,
        services_1.FileService,
        services_2.UserService,
        services_4.FavouriteService,
        services_3.PerformerBlockSettingService])
], MessageService);
exports.MessageService = MessageService;
//# sourceMappingURL=message.service.js.map