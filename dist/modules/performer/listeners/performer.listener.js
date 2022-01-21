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
exports.PerformerListener = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const lodash_1 = require("lodash");
const kernel_1 = require("../../../kernel");
const constants_1 = require("../constants");
const settings_1 = require("../../settings");
const constants_2 = require("../../settings/constants");
const constant_1 = require("../../stream/constant");
const services_1 = require("../../studio/services");
const socket_user_service_1 = require("../../socket/services/socket-user.service");
const services_2 = require("../../message/services");
const dtos_1 = require("../../message/dtos");
const string_helper_1 = require("../../../kernel/helpers/string.helper");
const constants_3 = require("../../../kernel/constants");
const providers_1 = require("../providers");
const services_3 = require("../services");
const dtos_2 = require("../dtos");
const PERFORMER_STUDIO_UPDATED = 'PERFORMER_STUDIO_UPDATED';
const PERFORMER_STEAMING_STATUS_UPDATED = 'PERFORMER_STEAMING_STATUS_UPDATED';
let PerformerListener = class PerformerListener {
    constructor(PerformerCommission, queueEventService, performerCommsionService, settingService, studioService, performerService, socketUserService, conversationService) {
        this.PerformerCommission = PerformerCommission;
        this.queueEventService = queueEventService;
        this.performerCommsionService = performerCommsionService;
        this.settingService = settingService;
        this.studioService = studioService;
        this.performerService = performerService;
        this.socketUserService = socketUserService;
        this.conversationService = conversationService;
        this.queueEventService.subscribe(constants_1.PERFORMER_CHANNEL, PERFORMER_STUDIO_UPDATED, this.studioUpdatedHandler.bind(this));
        this.queueEventService.subscribe(constants_1.PERFORMER_STEAMING_STATUS_CHANNEL, PERFORMER_STEAMING_STATUS_UPDATED, this.performerStreamStatusHandler.bind(this));
    }
    async studioUpdatedHandler(event) {
        if (event.eventName !== constants_3.EVENT.UPDATED)
            return;
        const { performer, oldStudioId } = event.data;
        if (performer.studioId && `${performer.studioId}` !== `${oldStudioId}`) {
            const studio = await this.studioService.findById(performer.studioId);
            if (!studio) {
                return;
            }
            const [defaultPerformerCommssion, defaultStudioCommission] = await Promise.all([
                this.settingService.getKeyValue(constants_2.SETTING_KEYS.PERFORMER_COMMISSION) || 0,
                this.settingService.getKeyValue(constants_2.SETTING_KEYS.STUDIO_COMMISSION) || 0
            ]);
            let performerCommission = await this.performerCommsionService.findOne({
                performerId: performer._id
            });
            if (performerCommission) {
                performerCommission.studioCommission =
                    studio.commission || defaultStudioCommission;
                performerCommission.memberCommission = parseInt(process.env.COMMISSION_RATE, 10);
                await performerCommission.save();
                return;
            }
            performerCommission = new this.PerformerCommission();
            const infoData = {
                performerId: performer._id,
                tipCommission: defaultPerformerCommssion,
                albumCommission: defaultPerformerCommssion,
                groupCallCommission: defaultPerformerCommssion,
                privateCallCommission: defaultPerformerCommssion,
                productCommission: defaultPerformerCommssion,
                videoCommission: defaultPerformerCommssion,
                studioCommission: studio.commission || defaultStudioCommission,
                memberCommission: parseInt(process.env.COMMISSION_RATE, 10)
            };
            lodash_1.merge(performerCommission, infoData);
            await performerCommission.save();
        }
        if (!performer.studioId && oldStudioId) {
            let commssion = await this.performerCommsionService.findOne({
                performerId: performer._id
            });
            if (!commssion) {
                const defaultPerformerCommssion = (await this.settingService.getKeyValue(constants_2.SETTING_KEYS.PERFORMER_COMMISSION)) || 0;
                commssion = new this.PerformerCommission();
                commssion.set('performerId', performer._id);
                constants_1.INITIALIZE_COMMISSION.forEach(type => {
                    commssion[type] = defaultPerformerCommssion;
                });
            }
            commssion.studioCommission = 1;
            await commssion.save();
            await this.queueEventService.publish({
                channel: 'STUDIO_MEMBER_CHANNEL',
                eventName: constants_3.EVENT.UPDATED,
                data: { studioId: oldStudioId, total: -1 }
            });
        }
    }
    async performerStreamStatusHandler(event) {
        try {
            if (![constant_1.PRIVATE_CHAT, constant_1.GROUP_CHAT, constant_1.PUBLIC_CHAT, constant_1.OFFLINE].includes(event.eventName)) {
                return;
            }
            const { id } = event.data;
            const performer = await this.performerService.findById(id);
            if (!performer) {
                return;
            }
            await this.socketUserService.emitToConnectedUsers('modelUpdateStreamingStatus', {
                id,
                performer: new dtos_2.PerformerDto(performer).toSearchResponse(),
                status: event.eventName
            });
            const conversation = await this.conversationService.findPerformerPublicConversation(id);
            if (!conversation) {
                return;
            }
            const conversationDto = new dtos_1.ConversationDto(conversation);
            const roomName = conversationDto.serializeConversation();
            if (event.eventName === constant_1.PRIVATE_CHAT) {
                await this.socketUserService.emitToRoom(roomName, `message_created_conversation_${conversation._id}`, {
                    _id: string_helper_1.generateUuid(),
                    text: 'The model is in private chat/C2C with another user',
                    conversationId: conversation._id,
                    isSystem: true
                });
            }
            else if (event.eventName === constant_1.GROUP_CHAT) {
                await this.socketUserService.emitToRoom(roomName, `message_created_conversation_${conversation._id}`, {
                    _id: string_helper_1.generateUuid(),
                    text: 'The model is in a Group show and will be back after the show ends.',
                    conversationId: conversation._id,
                    isSystem: true
                });
            }
        }
        catch (err) {
            console.log(err);
        }
    }
};
PerformerListener = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(providers_1.PERFORMER_COMMISSION_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        kernel_1.QueueEventService,
        services_3.PerformerCommissionService,
        settings_1.SettingService,
        services_1.StudioService,
        services_3.PerformerService,
        socket_user_service_1.SocketUserService,
        services_2.ConversationService])
], PerformerListener);
exports.PerformerListener = PerformerListener;
//# sourceMappingURL=performer.listener.js.map