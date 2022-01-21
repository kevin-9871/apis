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
exports.ConversationService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const string_helper_1 = require("../../../kernel/helpers/string.helper");
const services_1 = require("../../user/services");
const services_2 = require("../../performer/services");
const dtos_1 = require("../../user/dtos");
const dtos_2 = require("../../performer/dtos");
const dtos_3 = require("../../stream/dtos");
const kernel_1 = require("../../../kernel");
const dtos_4 = require("../dtos");
const constants_1 = require("../constants");
const providers_1 = require("../providers");
let ConversationService = class ConversationService {
    constructor(conversationModel, userService, userSearchService, performerSearchService, performerService, notiticationMessageModel) {
        this.conversationModel = conversationModel;
        this.userService = userService;
        this.userSearchService = userSearchService;
        this.performerSearchService = performerSearchService;
        this.performerService = performerService;
        this.notiticationMessageModel = notiticationMessageModel;
    }
    async find(params) {
        return this.conversationModel.find(params);
    }
    async findOne(params) {
        return this.conversationModel.findOne(params);
    }
    async createPrivateConversation(sender, receiver) {
        let conversation = await this.conversationModel
            .findOne({
            type: constants_1.CONVERSATION_TYPE.PRIVATE,
            recipients: {
                $all: [
                    {
                        source: sender.source,
                        sourceId: string_helper_1.toObjectId(sender.sourceId)
                    },
                    {
                        source: receiver.source,
                        sourceId: receiver.sourceId
                    }
                ]
            }
        })
            .lean()
            .exec();
        if (!conversation) {
            conversation = await this.conversationModel.create({
                type: constants_1.CONVERSATION_TYPE.PRIVATE,
                recipients: [sender, receiver],
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }
        const dto = new dtos_4.ConversationDto(conversation);
        dto.totalNotSeenMessages = 0;
        if (receiver.source === 'performer') {
            const per = await this.performerService.findById(receiver.sourceId);
            if (per) {
                dto.recipientInfo = new dtos_2.PerformerDto(per).toResponse(false);
            }
        }
        if (receiver.source === 'user') {
            const user = await this.userService.findById(receiver.sourceId);
            if (user)
                dto.recipientInfo = new dtos_1.UserDto(user).toResponse(false);
        }
        return dto;
    }
    async getList(req, sender) {
        let query = {
            recipients: {
                $elemMatch: {
                    source: sender.source,
                    sourceId: string_helper_1.toObjectId(sender.sourceId)
                }
            }
        };
        if (req.keyword) {
            let usersSearch = null;
            if (sender.source === 'user') {
                usersSearch = await this.performerSearchService.searchByKeyword({
                    q: req.keyword
                });
            }
            if (sender.source === 'performer') {
                usersSearch = await this.userSearchService.searchByKeyword({
                    q: req.keyword
                });
            }
            const Ids = usersSearch && usersSearch ? usersSearch.map(u => u._id) : [];
            query = {
                $and: [
                    {
                        recipients: {
                            $elemMatch: {
                                source: sender.source === 'user' ? 'performer' : 'user',
                                sourceId: { $in: Ids }
                            }
                        }
                    },
                    {
                        recipients: {
                            $elemMatch: {
                                source: sender.source,
                                sourceId: string_helper_1.toObjectId(sender.sourceId)
                            }
                        }
                    }
                ]
            };
        }
        if (req.type) {
            query.type = req.type;
        }
        const [data, total] = await Promise.all([
            this.conversationModel
                .find(query)
                .lean()
                .sort({ lastMessageCreatedAt: -1, updatedAt: -1 }),
            this.conversationModel.countDocuments(query)
        ]);
        const recipientIds = data.map(c => {
            const re = c.recipients.find(rep => rep.sourceId.toString() !== sender.sourceId.toString());
            return re && re.sourceId;
        });
        const conversationIds = data.map(d => d._id);
        let users = [];
        let performers = [];
        const notifications = conversationIds.length
            ? await this.notiticationMessageModel.find({
                conversationId: { $in: conversationIds }
            })
            : [];
        if (sender.source === 'user') {
            performers = recipientIds.length
                ? await this.performerService.findByIds(recipientIds)
                : [];
        }
        if (sender.source === 'performer') {
            users = recipientIds.length
                ? await this.userService.findByIds(recipientIds)
                : [];
        }
        const conversations = data.map(d => {
            const conversation = new dtos_4.ConversationDto(d);
            const recipient = conversation.recipients.find(rep => rep.sourceId.toString() !== sender.sourceId.toString());
            let recipientInfo = null;
            if (recipient) {
                if (users.length) {
                    recipientInfo = users.find(u => u._id.toString() === recipient.sourceId.toString());
                }
                if (performers.length) {
                    recipientInfo = performers.find(p => p._id.toString() === recipient.sourceId.toString());
                }
                const conversationNotifications = notifications.length &&
                    notifications.filter(noti => noti.conversationId.toString() === conversation._id.toString());
                const recipientNoti = conversationNotifications &&
                    conversationNotifications.find(c => c.recipientId.toString() === sender.sourceId.toString());
                return Object.assign(Object.assign({}, conversation), { recipientInfo: new dtos_1.UserDto(recipientInfo).toResponse(), totalNotSeenMessages: recipientNoti
                        ? recipientNoti.totalNotReadMessage
                        : 0 });
            }
            return conversation;
        });
        return {
            data: conversations,
            total
        };
    }
    async findById(id) {
        return this.conversationModel
            .findOne({
            _id: id
        })
            .lean()
            .exec();
    }
    async findByIds(ids) {
        return this.conversationModel.find({
            _id: { $in: ids }
        });
    }
    async findDetail(id, sender) {
        const conversation = await this.conversationModel.findOne({ _id: id });
        if (!conversation) {
            throw new kernel_1.EntityNotFoundException();
        }
        const recipientIds = conversation.recipients.filter(r => sender.source !== r.source).map(r => r.sourceId);
        let recipents = [];
        if (recipientIds.length && sender.source === 'user') {
            recipents = await this.performerService.findByIds(recipientIds);
        }
        if (recipientIds.length && sender.source === 'performer') {
            recipents = await this.userService.findByIds(recipientIds);
        }
        const dto = new dtos_4.ConversationDto(conversation);
        if (recipents.length) {
            dto.recipientInfo = new dtos_1.UserDto(recipents[0]).toResponse();
        }
        return dto;
    }
    async findPerformerPublicConversation(performerId) {
        return this.conversationModel
            .findOne({
            type: `stream_${constants_1.CONVERSATION_TYPE.PUBLIC}`,
            performerId
        })
            .lean()
            .exec();
    }
    async createStreamConversation(stream, recipients) {
        return this.conversationModel.create({
            streamId: stream._id,
            performerId: stream.performerId ? stream.performerId : null,
            recipients: recipients || [],
            name: `stream_${stream.type}_performerId_${stream.performerId}`,
            type: `stream_${stream.type}`,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }
    async getPrivateConversationByStreamId(streamId) {
        const conversation = await this.conversationModel.findOne({ streamId });
        if (!conversation) {
            throw new common_1.NotFoundException();
        }
        return new dtos_4.ConversationDto(conversation);
    }
    async addRecipient(conversationId, recipient) {
        return this.conversationModel.updateOne({ _id: conversationId }, { $addToSet: { recipients: recipient } });
    }
    serializeConversation(id, type) {
        return `conversation:${type}:${id}`;
    }
    deserializeConversationId(str) {
        const strs = str.split(':');
        if (!strs.length)
            return '';
        return strs[strs.length - 1];
    }
};
ConversationService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(providers_1.CONVERSATION_MODEL_PROVIDER)),
    __param(1, common_1.Inject(common_1.forwardRef(() => services_1.UserService))),
    __param(2, common_1.Inject(common_1.forwardRef(() => services_1.UserSearchService))),
    __param(3, common_1.Inject(common_1.forwardRef(() => services_2.PerformerSearchService))),
    __param(4, common_1.Inject(common_1.forwardRef(() => services_2.PerformerService))),
    __param(5, common_1.Inject(providers_1.NOTIFICATION_MESSAGE_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        services_1.UserService,
        services_1.UserSearchService,
        services_2.PerformerSearchService,
        services_2.PerformerService,
        mongoose_1.Model])
], ConversationService);
exports.ConversationService = ConversationService;
//# sourceMappingURL=conversation.service.js.map