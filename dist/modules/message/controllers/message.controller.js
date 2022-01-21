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
exports.MessageController = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const guards_1 = require("../../auth/guards");
const file_1 = require("../../file");
const decorators_1 = require("../../auth/decorators");
const dtos_1 = require("../../user/dtos");
const dtos_2 = require("../../performer/dtos");
const services_1 = require("../services");
const payloads_1 = require("../payloads");
let MessageController = class MessageController {
    constructor(messageService, notificationMessageService) {
        this.messageService = messageService;
        this.notificationMessageService = notificationMessageService;
    }
    async createPrivateFileMessage(files, payload, req) {
        if (req.authUser.sourceId.toString() === payload.recipientId.toString()) {
            throw new common_1.ForbiddenException();
        }
        const message = await this.messageService.createPrivateFileMessage({
            source: req.authUser.source,
            sourceId: req.authUser.sourceId
        }, {
            source: payload.recipientType,
            sourceId: payload.recipientId
        }, files['message-photo'], payload, req);
        return kernel_1.DataResponse.ok(message);
    }
    async readAllMessage(payload, req) {
        if (req.authUser.sourceId.toString() !== payload.recipientId.toString()) {
            throw new common_1.ForbiddenException();
        }
        const message = await this.notificationMessageService.recipientReadAllMessageInConversation(req.authUser.sourceId, payload.conversationId);
        return kernel_1.DataResponse.ok(message);
    }
    async countTotalNotReadMessage(user) {
        const data = await this.notificationMessageService.countTotalNotReadMessage(user);
        return kernel_1.DataResponse.ok(data);
    }
    async loadMessages(req, conversationId, user) {
        req.conversationId = conversationId;
        const data = await this.messageService.loadMessages(req, user);
        return kernel_1.DataResponse.ok(data);
    }
    async loadPublicMessages(req, conversationId) {
        req.conversationId = conversationId;
        const data = await this.messageService.loadPublicMessages(req);
        return kernel_1.DataResponse.ok(data);
    }
    async createMessage(payload, conversationId, req) {
        const data = await this.messageService.createPrivateMessageFromConversation(conversationId, payload, {
            source: req.authUser.source,
            sourceId: req.authUser.sourceId
        }, req);
        return kernel_1.DataResponse.ok(data);
    }
    async createStreamMessage(payload, conversationId, req) {
        const data = await this.messageService.createStreamMessageFromConversation(conversationId, payload, {
            source: req.authUser.source,
            sourceId: req.authUser.sourceId
        }, req);
        return kernel_1.DataResponse.ok(data);
    }
    async createPublicStreamMessage(payload, conversationId, req, user) {
        const data = await this.messageService.createPublicStreamMessageFromConversation(conversationId, payload, {
            source: req.authUser.source,
            sourceId: req.authUser.sourceId
        }, user, req);
        return kernel_1.DataResponse.ok(data);
    }
    async deletePublicMessage(messageId, user) {
        const data = await this.messageService.deleteMessage(messageId, user);
        return kernel_1.DataResponse.ok(data);
    }
    async deleteAllPublicMessage(conversationId, user) {
        const data = await this.messageService.deleteAllMessageInConversation(conversationId, user);
        return kernel_1.DataResponse.ok(data);
    }
    async sendMessageToAllFollowers(payload, performer) {
        await this.messageService.sendMessageToAllFollowers(performer._id, payload);
        return kernel_1.DataResponse.ok({ success: true });
    }
};
__decorate([
    common_1.Post('/private/file'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(guards_1.AuthGuard),
    common_1.UseInterceptors(file_1.MultiFileUploadInterceptor([
        {
            type: 'message-photo',
            fieldName: 'message-photo',
            options: {
                destination: kernel_1.getConfig('file').photoProtectedDir,
                replaceWithoutExif: true
            }
        }
    ])),
    __param(0, file_1.FilesUploaded()),
    __param(1, common_1.Body()),
    __param(2, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, payloads_1.PrivateMessageCreatePayload, Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "createPrivateFileMessage", null);
__decorate([
    common_1.Post('/read-all'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(guards_1.AuthGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Body()),
    __param(1, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.NotificationMessageReadPayload, Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "readAllMessage", null);
__decorate([
    common_1.Get('/counting-not-read-messages'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(guards_1.AuthGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "countTotalNotReadMessage", null);
__decorate([
    common_1.Get('/conversations/:conversationId'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(guards_1.AuthGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __param(1, common_1.Param('conversationId')),
    __param(2, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.MessageListRequest, String, dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "loadMessages", null);
__decorate([
    common_1.Get('/conversations/public/:conversationId'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __param(1, common_1.Param('conversationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.MessageListRequest, String]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "loadPublicMessages", null);
__decorate([
    common_1.Post('/conversations/:conversationId'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(guards_1.AuthGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Body()),
    __param(1, common_1.Param('conversationId')),
    __param(2, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.MessageCreatePayload, String, Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "createMessage", null);
__decorate([
    common_1.Post('/stream/conversations/:conversationId'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(guards_1.AuthGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Body()),
    __param(1, common_1.Param('conversationId')),
    __param(2, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.MessageCreatePayload, String, Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "createStreamMessage", null);
__decorate([
    common_1.Post('/stream/public/conversations/:conversationId'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(guards_1.AuthGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Body()),
    __param(1, common_1.Param('conversationId')),
    __param(2, common_1.Request()),
    __param(3, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.MessageCreatePayload, String, Object, dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "createPublicStreamMessage", null);
__decorate([
    common_1.Delete('/:messageId'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(guards_1.AuthGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Param('messageId')),
    __param(1, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "deletePublicMessage", null);
__decorate([
    common_1.Delete('/:conversationId/remove-all-message'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(guards_1.AuthGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Param('conversationId')),
    __param(1, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "deleteAllPublicMessage", null);
__decorate([
    common_1.Post('/follower'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('performer'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Body()),
    __param(1, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.MessageCreatePayload,
        dtos_2.PerformerDto]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "sendMessageToAllFollowers", null);
MessageController = __decorate([
    common_1.Injectable(),
    common_1.Controller('messages'),
    __metadata("design:paramtypes", [services_1.MessageService,
        services_1.NotificationMessageService])
], MessageController);
exports.MessageController = MessageController;
//# sourceMappingURL=message.controller.js.map