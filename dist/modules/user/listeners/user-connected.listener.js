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
exports.UserConnectedListener = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const mongoose_1 = require("mongoose");
const constants_1 = require("../../socket/constants");
const providers_1 = require("../providers");
const HANDLE_USER_ONLINE_OFFLINE = 'HANDLE_USER_ONLINE_OFFLINE';
let UserConnectedListener = class UserConnectedListener {
    constructor(queueEventService, userModel) {
        this.queueEventService = queueEventService;
        this.userModel = userModel;
        this.queueEventService.subscribe(constants_1.USER_SOCKET_CONNECTED_CHANNEL, HANDLE_USER_ONLINE_OFFLINE, this.handleOnlineOffline.bind(this));
    }
    async handleOnlineOffline(event) {
        const { source, sourceId } = event.data;
        if (source !== 'user') {
            return;
        }
        const user = await this.userModel.findById(sourceId);
        if (!user) {
            return;
        }
        let increaseTime = 0;
        if (event.eventName === constants_1.USER_SOCKET_EVENT.DISCONNECTED && user.onlineAt) {
            const today = new Date();
            const lastOnlineAt = new Date(`${user.onlineAt}`);
            increaseTime = Math.round((today.getTime() - lastOnlineAt.getTime()) / 1000);
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
                    onlineAt: null,
                    offlineAt: new Date(),
                    $inc: { totalOnlineTime: increaseTime }
                };
                break;
            default: return;
        }
        await this.userModel.updateOne({ _id: sourceId }, updateData, {
            upsert: false
        });
    }
};
UserConnectedListener = __decorate([
    common_1.Injectable(),
    __param(1, common_1.Inject(providers_1.USER_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [kernel_1.QueueEventService,
        mongoose_1.Model])
], UserConnectedListener);
exports.UserConnectedListener = UserConnectedListener;
//# sourceMappingURL=user-connected.listener.js.map