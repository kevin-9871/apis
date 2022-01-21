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
exports.PerformerConnectedListener = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const mongoose_1 = require("mongoose");
const constants_1 = require("../../socket/constants");
const socket_user_service_1 = require("../../socket/services/socket-user.service");
const constant_1 = require("../../stream/constant");
const providers_1 = require("../providers");
const dtos_1 = require("../dtos");
const HANDLE_PERFORMER_ONLINE_OFFLINE = 'HANDLE_PERFORMER_ONLINE_OFFLINE';
let PerformerConnectedListener = class PerformerConnectedListener {
    constructor(queueEventService, socketUserService, performerModel) {
        this.queueEventService = queueEventService;
        this.socketUserService = socketUserService;
        this.performerModel = performerModel;
        this.queueEventService.subscribe(constants_1.PERFORMER_SOCKET_CONNECTED_CHANNEL, HANDLE_PERFORMER_ONLINE_OFFLINE, this.handleOnlineOffline.bind(this));
    }
    async handleOnlineOffline(event) {
        const { source, sourceId } = event.data;
        if (source !== 'performer') {
            return;
        }
        const performer = await this.performerModel.findOne({ _id: sourceId });
        if (!performer) {
            return;
        }
        let updateData = {};
        switch (event.eventName) {
            case constants_1.USER_SOCKET_EVENT.CONNECTED:
                updateData = {
                    isOnline: true,
                    onlineAt: new Date(),
                    offlineAt: null
                };
                break;
            case constants_1.USER_SOCKET_EVENT.DISCONNECTED:
                updateData = {
                    isOnline: false,
                    streamingStatus: constant_1.OFFLINE,
                    onlineAt: null,
                    offlineAt: new Date()
                };
                break;
            default:
                return;
        }
        await this.performerModel.updateOne({ _id: sourceId }, updateData, {
            upsert: false
        });
        await this.socketUserService.emitToConnectedUsers('modelUpdateStatus', {
            status: event.eventName,
            performer: new dtos_1.PerformerDto(performer).toSearchResponse(),
            id: sourceId
        });
    }
};
PerformerConnectedListener = __decorate([
    common_1.Injectable(),
    __param(2, common_1.Inject(providers_1.PERFORMER_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [kernel_1.QueueEventService,
        socket_user_service_1.SocketUserService,
        mongoose_1.Model])
], PerformerConnectedListener);
exports.PerformerConnectedListener = PerformerConnectedListener;
//# sourceMappingURL=performer-connected.listener.js.map