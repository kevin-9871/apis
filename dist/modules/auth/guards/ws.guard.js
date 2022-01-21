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
exports.WSGuard = void 0;
const common_1 = require("@nestjs/common");
const services_1 = require("../../user/services");
const websockets_1 = require("@nestjs/websockets");
const services_2 = require("../services");
let WSGuard = class WSGuard {
    constructor(authService, userService) {
        this.authService = authService;
        this.userService = userService;
    }
    async canActivate(context) {
        const client = context.switchToWs().getClient();
        const { handshake } = client;
        console.log(client, handshake);
        throw new websockets_1.WsException('forbiden');
    }
};
WSGuard = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [services_2.AuthService,
        services_1.UserService])
], WSGuard);
exports.WSGuard = WSGuard;
//# sourceMappingURL=ws.guard.js.map