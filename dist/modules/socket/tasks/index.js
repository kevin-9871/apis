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
exports.SocketUserTask = exports.DISCONENNCT_OFFLINE_SOCKET_ISCHEDULE = void 0;
const common_1 = require("@nestjs/common");
const agenda_1 = require("../../../kernel/infras/agenda");
const services_1 = require("../../auth/services");
const socket_user_service_1 = require("../services/socket-user.service");
exports.DISCONENNCT_OFFLINE_SOCKET_ISCHEDULE = 'DISCONENNCT_OFFLINE_SOCKET_ISCHEDULE';
let SocketUserTask = class SocketUserTask {
    constructor(authService, agendaService, socketUserService) {
        this.authService = authService;
        this.agendaService = agendaService;
        this.socketUserService = socketUserService;
        this.agendaService.define(exports.DISCONENNCT_OFFLINE_SOCKET_ISCHEDULE, {}, this.handler.bind(this));
        this.agendaService.every('2 minutes', exports.DISCONENNCT_OFFLINE_SOCKET_ISCHEDULE);
    }
    async handler(_, done) {
        try {
            const connectedSockets = await this.socketUserService.getConnectedSocket();
            const connectedSocketIds = Object.keys(connectedSockets).map(id => id);
            if (connectedSocketIds.length) {
                connectedSocketIds.forEach(id => {
                    if (connectedSockets[id].handshake.query.token) {
                        const decodeded = this.authService.verifyJWT(connectedSockets[id].handshake.query.token);
                        if (!decodeded) {
                            connectedSockets[id].disconnect(true);
                        }
                    }
                });
            }
        }
        catch (err) {
            console.log(err);
        }
        finally {
            done();
        }
    }
};
SocketUserTask = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(common_1.forwardRef(() => services_1.AuthService))),
    __metadata("design:paramtypes", [services_1.AuthService,
        agenda_1.AgendaService,
        socket_user_service_1.SocketUserService])
], SocketUserTask);
exports.SocketUserTask = SocketUserTask;
//# sourceMappingURL=index.js.map