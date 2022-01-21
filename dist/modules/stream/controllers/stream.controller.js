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
exports.StreamController = void 0;
const common_1 = require("@nestjs/common");
const guards_1 = require("../../auth/guards");
const kernel_1 = require("../../../kernel");
const decorators_1 = require("../../auth/decorators");
const dtos_1 = require("../../performer/dtos");
const dtos_2 = require("../../user/dtos");
const stream_service_1 = require("../services/stream.service");
const payloads_1 = require("../payloads");
let StreamController = class StreamController {
    constructor(streamService) {
        this.streamService = streamService;
    }
    async getSessionId(performer, param) {
        const sessionId = await this.streamService.getSessionId(performer._id, param.type);
        return kernel_1.DataResponse.ok(sessionId);
    }
    async getPerformerSessionId(params) {
        const sessionId = await this.streamService.getSessionId(params.id, params.type);
        return kernel_1.DataResponse.ok(sessionId);
    }
    async goLive(performer) {
        const data = await this.streamService.goLive(performer._id);
        return kernel_1.DataResponse.ok(data);
    }
    async join(performerId) {
        const data = await this.streamService.joinPublicChat(performerId);
        return kernel_1.DataResponse.ok(data);
    }
    async requestPrivateChat(performerId, user) {
        const data = await this.streamService.requestPrivateChat(user, performerId);
        return kernel_1.DataResponse.ok(data);
    }
    async accpetPrivateChat(id, performer) {
        const data = await this.streamService.accpetPrivateChat(id, performer._id);
        return kernel_1.DataResponse.ok(data);
    }
    async joinGroupChat(id, user) {
        const data = await this.streamService.joinGroupChat(id, user);
        return kernel_1.DataResponse.ok(data);
    }
    async startGroupChat(performer) {
        const data = await this.streamService.startGroupChat(performer._id);
        return kernel_1.DataResponse.ok(data);
    }
    async antmediaWebhook(payload) {
        await this.streamService.webhook(payload.sessionId || payload.id, payload);
        return kernel_1.DataResponse.ok();
    }
    async getOneTimeToken(user, payload) {
        const result = await this.streamService.getOneTimeToken(payload, user._id.toString());
        return kernel_1.DataResponse.ok(result);
    }
};
__decorate([
    common_1.Get('/session/:type'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('performer'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, decorators_1.CurrentUser()),
    __param(1, common_1.Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.PerformerDto,
        payloads_1.StreamPayload]),
    __metadata("design:returntype", Promise)
], StreamController.prototype, "getSessionId", null);
__decorate([
    common_1.Get('/session/:id/:type'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Param()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.StreamPayload]),
    __metadata("design:returntype", Promise)
], StreamController.prototype, "getPerformerSessionId", null);
__decorate([
    common_1.Post('/live'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('performer'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.PerformerDto]),
    __metadata("design:returntype", Promise)
], StreamController.prototype, "goLive", null);
__decorate([
    common_1.Post('/join/:id'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StreamController.prototype, "join", null);
__decorate([
    common_1.Post('/private-chat/:id'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(guards_1.AuthGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Param('id')),
    __param(1, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_2.UserDto]),
    __metadata("design:returntype", Promise)
], StreamController.prototype, "requestPrivateChat", null);
__decorate([
    common_1.Get('/private-chat/:id'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(guards_1.AuthGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Param('id')),
    __param(1, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.PerformerDto]),
    __metadata("design:returntype", Promise)
], StreamController.prototype, "accpetPrivateChat", null);
__decorate([
    common_1.Get('/group-chat/:id'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(guards_1.AuthGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Param('id')),
    __param(1, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_2.UserDto]),
    __metadata("design:returntype", Promise)
], StreamController.prototype, "joinGroupChat", null);
__decorate([
    common_1.Post('/group-chat'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(guards_1.RoleGuard),
    decorators_1.Roles('performer'),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.PerformerDto]),
    __metadata("design:returntype", Promise)
], StreamController.prototype, "startGroupChat", null);
__decorate([
    common_1.Post('/antmedia/webhook'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StreamController.prototype, "antmediaWebhook", null);
__decorate([
    common_1.Post('/token'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(guards_1.AuthGuard),
    __param(0, decorators_1.CurrentUser()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_2.UserDto,
        payloads_1.TokenCreatePayload]),
    __metadata("design:returntype", Promise)
], StreamController.prototype, "getOneTimeToken", null);
StreamController = __decorate([
    common_1.Injectable(),
    common_1.Controller('streaming'),
    __metadata("design:paramtypes", [stream_service_1.StreamService])
], StreamController);
exports.StreamController = StreamController;
//# sourceMappingURL=stream.controller.js.map