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
exports.BlockUserListener = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const socket_user_service_1 = require("../../socket/services/socket-user.service");
const constants_1 = require("../constants");
const BLOCK_USERS_NOTIFY = 'BLOCK_USERS_NOTIFY';
let BlockUserListener = class BlockUserListener {
    constructor(queueEventService, socketUserService) {
        this.queueEventService = queueEventService;
        this.socketUserService = socketUserService;
        this.queueEventService.subscribe(constants_1.BLOCK_USERS_CHANNEL, BLOCK_USERS_NOTIFY, this.handleMessage.bind(this));
    }
    async handleMessage(event) {
        if (event.eventName !== constants_1.BLOCK_ACTION.CREATED)
            return;
        const data = event.data;
        if (!data.userIds.length || !data.performerId)
            return;
        this.socketUserService.emitToUsers(data.userIds, 'nofify_users_block', { performerId: data.performerId });
    }
};
BlockUserListener = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [kernel_1.QueueEventService,
        socket_user_service_1.SocketUserService])
], BlockUserListener);
exports.BlockUserListener = BlockUserListener;
//# sourceMappingURL=notify-block-users.listener.js.map