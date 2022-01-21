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
exports.AdminPerformerController = void 0;
const common_1 = require("@nestjs/common");
const guards_1 = require("../../auth/guards");
const kernel_1 = require("../../../kernel");
const decorators_1 = require("../../auth/decorators");
const services_1 = require("../../auth/services");
const dtos_1 = require("../../user/dtos");
const file_1 = require("../../file");
const json2csv_1 = require("json2csv");
const services_2 = require("../../message/services");
const socket_user_service_1 = require("../../socket/services/socket-user.service");
const dtos_2 = require("../dtos");
const payloads_1 = require("../payloads");
const services_3 = require("../services");
let AdminPerformerController = class AdminPerformerController {
    constructor(performerService, performerSearchService, conversationService, socketUserService, authService) {
        this.performerService = performerService;
        this.performerSearchService = performerSearchService;
        this.conversationService = conversationService;
        this.socketUserService = socketUserService;
        this.authService = authService;
    }
    async search(req, currentUser) {
        const results = await this.performerSearchService.search(req, currentUser);
        return kernel_1.DataResponse.ok(results);
    }
    async searchOnline(req, currentUser) {
        req.isOnline = true;
        const results = await this.performerSearchService.search(req, currentUser);
        const performerIds = results.data.map(p => p._id);
        const conversations = await Promise.all(performerIds.map(id => this.conversationService.findPerformerPublicConversation(id)));
        const watchings = await Promise.all(performerIds.map((id, index) => conversations[index] ? this.socketUserService.countRoomUserConnections(id.toString()) : 0));
        return kernel_1.DataResponse.ok(Object.assign(Object.assign({}, results), { data: results.data.map((p, index) => (Object.assign(Object.assign({}, p), { watching: watchings[index] }))) }));
    }
    async create(currentUser, payload) {
        const { password } = payload;
        delete payload.password;
        const performer = await this.performerService.create(payload, currentUser);
        if (password) {
            await Promise.all([
                this.authService.create({
                    source: 'performer',
                    sourceId: performer._id,
                    type: 'email',
                    key: performer.email.toLowerCase().trim(),
                    value: password
                }),
                this.authService.create({
                    source: 'performer',
                    sourceId: performer._id,
                    type: 'username',
                    key: performer.username.trim(),
                    value: password
                })
            ]);
        }
        return kernel_1.DataResponse.ok(performer);
    }
    async updateUser(payload, performerId, req) {
        const oldPerformer = await this.performerService.getDetails(performerId, req.jwToken);
        await this.performerService.adminUpdate(performerId, payload);
        const performer = await this.performerService.getDetails(performerId, req.jwToken);
        if (payload.username && oldPerformer.username && oldPerformer.username.toLowerCase() !== payload.username.toLowerCase()) {
            await this.authService.changeNewKey(performer._id, 'username', payload.username.toLowerCase());
        }
        if (payload.email && oldPerformer.email && oldPerformer.email.toLowerCase() !== payload.email.toLowerCase()) {
            await this.authService.changeNewKey(performer._id, 'email', payload.email.toLowerCase());
        }
        return kernel_1.DataResponse.ok(performer);
    }
    async getDetails(performerId, req) {
        const performer = await this.performerService.getDetails(performerId, req.jwToken);
        return kernel_1.DataResponse.ok(new dtos_2.PerformerDto(performer).toResponse(true));
    }
    async uploadPerformerDocument(userId, file) {
        return kernel_1.DataResponse.ok(Object.assign(Object.assign({}, file), { url: file.getUrl() }));
    }
    async uploadPerformerAvatar(file) {
        return kernel_1.DataResponse.ok(Object.assign(Object.assign({}, file), { url: file.getUrl() }));
    }
    async exportCsv(query, nameFile, res, user) {
        const fileName = nameFile || 'performers_export.csv';
        const fields = [
            {
                label: 'Name',
                value: 'name'
            },
            {
                label: 'Username',
                value: 'username'
            },
            {
                label: 'Email',
                value: 'email'
            },
            {
                label: 'Phone',
                value: 'phone'
            },
            {
                label: 'Status',
                value: 'status'
            },
            {
                label: 'Gender',
                value: 'gender'
            },
            {
                label: 'Country',
                value: 'country'
            },
            {
                label: 'Balance',
                value: 'balance'
            }
        ];
        const { data } = await this.performerSearchService.search(Object.assign(Object.assign({}, query), { limit: 9999 }), user);
        const json2csv = new json2csv_1.Parser({ fields });
        const csv = json2csv.parse(data);
        res.header('Content-Type', 'text/csv');
        res.attachment(fileName);
        return res.send(csv);
    }
    async stats() {
        const results = await this.performerService.stats();
        return kernel_1.DataResponse.ok(results);
    }
};
__decorate([
    common_1.Get('/search'),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __param(1, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.PerformerSearchPayload,
        dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], AdminPerformerController.prototype, "search", null);
__decorate([
    common_1.Get('/online'),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __param(1, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.PerformerSearchPayload,
        dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], AdminPerformerController.prototype, "searchOnline", null);
__decorate([
    common_1.Post(),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, decorators_1.CurrentUser()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.UserDto,
        payloads_1.PerformerCreatePayload]),
    __metadata("design:returntype", Promise)
], AdminPerformerController.prototype, "create", null);
__decorate([
    common_1.Put('/:id'),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    __param(0, common_1.Body()),
    __param(1, common_1.Param('id')),
    __param(2, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.AdminUpdatePayload, String, Object]),
    __metadata("design:returntype", Promise)
], AdminPerformerController.prototype, "updateUser", null);
__decorate([
    common_1.Get('/:id/view'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminPerformerController.prototype, "getDetails", null);
__decorate([
    common_1.Post('/documents/upload'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UseInterceptors(file_1.FileUploadInterceptor('performer-document', 'file', {
        destination: kernel_1.getConfig('file').documentDir
    })),
    __param(0, common_1.Param('id')),
    __param(1, file_1.FileUploaded()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, file_1.FileDto]),
    __metadata("design:returntype", Promise)
], AdminPerformerController.prototype, "uploadPerformerDocument", null);
__decorate([
    common_1.Post('/avatar/upload'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UseInterceptors(file_1.FileUploadInterceptor('avatar', 'avatar', {
        destination: kernel_1.getConfig('file').avatarDir,
        generateThumbnail: true,
        replaceWithThumbail: true,
        thumbnailSize: kernel_1.getConfig('image').avatar
    })),
    __param(0, file_1.FileUploaded()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [file_1.FileDto]),
    __metadata("design:returntype", Promise)
], AdminPerformerController.prototype, "uploadPerformerAvatar", null);
__decorate([
    common_1.Get('/export/csv'),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __param(1, common_1.Query('fileName')),
    __param(2, common_1.Res()),
    __param(3, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.PerformerSearchPayload, String, Object, dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], AdminPerformerController.prototype, "exportCsv", null);
__decorate([
    common_1.Get('/stats'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminPerformerController.prototype, "stats", null);
AdminPerformerController = __decorate([
    common_1.Injectable(),
    common_1.Controller('admin/performers'),
    __metadata("design:paramtypes", [services_3.PerformerService,
        services_3.PerformerSearchService,
        services_2.ConversationService,
        socket_user_service_1.SocketUserService,
        services_1.AuthService])
], AdminPerformerController);
exports.AdminPerformerController = AdminPerformerController;
//# sourceMappingURL=admin-performer.controller.js.map