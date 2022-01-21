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
exports.WsUserConnectedGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const services_1 = require("../../auth/services");
const lodash_1 = require("lodash");
const kernel_1 = require("../../../kernel");
const constant_1 = require("../../stream/constant");
const dtos_1 = require("../../auth/dtos");
const common_1 = require("@nestjs/common");
const socket_user_service_1 = require("../services/socket-user.service");
const constants_1 = require("../constants");
let WsUserConnectedGateway = class WsUserConnectedGateway {
    constructor(authService, socketUserService, queueEventService) {
        this.authService = authService;
        this.socketUserService = socketUserService;
        this.queueEventService = queueEventService;
    }
    async handleConnection(client) {
        if (!client.handshake.query.token) {
            return;
        }
        await this.login(client, client.handshake.query.token);
    }
    async handleReconnection(client) {
        if (!client.handshake.query.token) {
            return;
        }
        await this.login(client, client.handshake.query.token);
    }
    async handleDisconnect(client) {
        if (!client.handshake.query.token) {
            return;
        }
        await this.logout(client, client.handshake.query.token);
    }
    async login(client, token) {
        const decodeded = this.authService.verifyJWT(token);
        if (!decodeded) {
            return;
        }
        const authUser = lodash_1.pick(decodeded, ['source', 'sourceId', 'authId']);
        await this.socketUserService.addConnection(authUser.sourceId, client.id);
        switch (authUser.source) {
            case 'user':
                await this.queueEventService.publish({
                    channel: constants_1.USER_SOCKET_CONNECTED_CHANNEL,
                    eventName: constants_1.USER_SOCKET_EVENT.CONNECTED,
                    data: authUser
                });
                break;
            case 'performer':
                await this.queueEventService.publish({
                    channel: constants_1.PERFORMER_SOCKET_CONNECTED_CHANNEL,
                    eventName: constants_1.USER_SOCKET_EVENT.CONNECTED,
                    data: authUser
                });
                break;
            default:
                break;
        }
    }
    async logout(client, token) {
        const decodeded = this.authService.decodeJWT(token);
        if (!decodeded) {
            return;
        }
        const authUser = lodash_1.pick(decodeded, ['source', 'sourceId', 'authId']);
        const connections = await this.socketUserService.getUserSocketIds(authUser.sourceId);
        if (!connections.length) {
            return;
        }
        if (!connections.includes(client.id)) {
            return;
        }
        const connectionLen = await this.socketUserService.removeConnection(authUser.sourceId, client.id);
        if (connectionLen) {
            return;
        }
        if (authUser.source === 'user') {
            await Promise.all([
                this.queueEventService.publish({
                    channel: constants_1.USER_SOCKET_CONNECTED_CHANNEL,
                    eventName: constants_1.USER_SOCKET_EVENT.DISCONNECTED,
                    data: authUser
                }),
                this.queueEventService.publish({
                    channel: constant_1.USER_LIVE_STREAM_CHANNEL,
                    eventName: constant_1.LIVE_STREAM_EVENT_NAME.DISCONNECTED,
                    data: authUser.sourceId
                })
            ]);
        }
        else if (authUser.source === 'performer') {
            await Promise.all([
                this.queueEventService.publish({
                    channel: constants_1.PERFORMER_SOCKET_CONNECTED_CHANNEL,
                    eventName: constants_1.USER_SOCKET_EVENT.DISCONNECTED,
                    data: authUser
                }),
                this.queueEventService.publish({
                    channel: constant_1.PERFORMER_LIVE_STREAM_CHANNEL,
                    eventName: constant_1.LIVE_STREAM_EVENT_NAME.DISCONNECTED,
                    data: authUser.sourceId
                })
            ]);
        }
    }
};
__decorate([
    websockets_1.SubscribeMessage('connect'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WsUserConnectedGateway.prototype, "handleConnection", null);
__decorate([
    websockets_1.SubscribeMessage('reconnect'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WsUserConnectedGateway.prototype, "handleReconnection", null);
__decorate([
    websockets_1.SubscribeMessage('disconnect'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WsUserConnectedGateway.prototype, "handleDisconnect", null);
WsUserConnectedGateway = __decorate([
    websockets_1.WebSocketGateway(),
    __param(0, common_1.Inject(common_1.forwardRef(() => services_1.AuthService))),
    __metadata("design:paramtypes", [services_1.AuthService,
        socket_user_service_1.SocketUserService,
        kernel_1.QueueEventService])
], WsUserConnectedGateway);
exports.WsUserConnectedGateway = WsUserConnectedGateway;
//# sourceMappingURL=user-connected.gateway.js.map