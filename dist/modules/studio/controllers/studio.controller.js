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
exports.StudioController = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const services_1 = require("../../auth/services");
const exceptions_1 = require("../../auth/exceptions");
const decorators_1 = require("../../auth/decorators");
const guards_1 = require("../../auth/guards");
const file_1 = require("../../file");
const services_2 = require("../../file/services");
const dtos_1 = require("../../performer/dtos");
const payloads_1 = require("../../performer/payloads");
const services_3 = require("../../performer/services");
const dtos_2 = require("../../user/dtos");
const lodash_1 = require("lodash");
const constants_1 = require("../../../kernel/constants");
const constants_2 = require("../constants");
const dtos_3 = require("../dtos");
const payloads_2 = require("../payloads");
const services_4 = require("../services");
let StudioController = class StudioController {
    constructor(studioService, performerService, performerSearchService, performerCommissionService, queueEventService, authService, fileService) {
        this.studioService = studioService;
        this.performerService = performerService;
        this.performerSearchService = performerSearchService;
        this.performerCommissionService = performerCommissionService;
        this.queueEventService = queueEventService;
        this.authService = authService;
        this.fileService = fileService;
    }
    async me(request) {
        const jwtToken = request.headers.authorization;
        const studio = await this.authService.getSourceFromJWT(jwtToken);
        if (!studio || studio.status !== constants_2.STUDIO_STATUES.ACTIVE) {
            throw new common_1.HttpException('Unauthorized', common_1.HttpStatus.UNAUTHORIZED);
        }
        const result = await this.studioService.detail(studio._id, jwtToken);
        return kernel_1.DataResponse.ok(result);
    }
    async detail(id, request) {
        const jwtToken = request.headers.authorization;
        const result = await this.studioService.detail(id, jwtToken);
        return kernel_1.DataResponse.ok(result);
    }
    async update(payload, currentStudio) {
        await this.studioService.update(currentStudio._id, lodash_1.omit(payload, constants_1.EXCLUDE_FIELDS));
        const studio = await this.studioService.findById(currentStudio._id);
        if (payload.documentVerificationId) {
            await this.fileService.addRef(payload.documentVerificationId, {
                itemId: studio._id,
                itemType: 'studio-document'
            });
        }
        return kernel_1.DataResponse.ok(new dtos_3.StudioDto(studio).toResponse(true));
    }
    async search(query) {
        const result = await this.studioService.search(query);
        return kernel_1.DataResponse.ok(result);
    }
    async members(query, user) {
        const result = await this.performerSearchService.search(Object.assign(Object.assign({}, query), { studioId: user._id.toString() }), user);
        return kernel_1.DataResponse.ok(result);
    }
    async register(payload) {
        const studio = await this.studioService.register(payload);
        await Promise.all([
            this.authService.create({
                source: 'studio',
                sourceId: studio._id,
                type: 'email',
                key: studio.email,
                value: payload.password
            }),
            this.authService.create({
                source: 'studio',
                sourceId: studio._id,
                type: 'username',
                key: studio.username,
                value: payload.password
            })
        ]);
        return kernel_1.DataResponse.ok(studio);
    }
    async updateDocumentVerification(file, studio, request) {
        if (file.type !== 'company-registration-certificate') {
            throw new exceptions_1.DocumentMissiongException();
        }
        await this.studioService.uploadDocument(studio, file._id);
        await this.fileService.addRef(file._id, {
            itemId: studio._id,
            itemType: 'studio-document'
        });
        await this.queueEventService.publish({
            channel: services_2.MEDIA_FILE_CHANNEL,
            eventName: services_2.FILE_EVENT.FILE_RELATED_MODULE_UPDATED,
            data: {
                type: services_2.DELETE_FILE_TYPE.FILEID,
                currentFile: studio.documentVerificationId,
                newFile: file._id
            }
        });
        const jwtToken = request.headers.authorization;
        return kernel_1.DataResponse.ok({
            file,
            url: jwtToken
                ? `${file_1.FileDto.getPublicUrl(file.path)}?documentId=${file._id}&token=${jwtToken}`
                : file_1.FileDto.getPublicUrl(file.path)
        });
    }
    async uploadDocumentVerification(file, request) {
        if (file.type !== 'company-registration-certificate') {
            throw new exceptions_1.DocumentMissiongException();
        }
        const jwtToken = request.headers.authorization;
        return kernel_1.DataResponse.ok({
            file,
            url: jwtToken
                ? `${file_1.FileDto.getPublicUrl(file.path)}?documentId=${file._id}&token=${jwtToken}`
                : file_1.FileDto.getPublicUrl(file.path)
        });
    }
    async adminUpdateDocumentVerification(file, id, request) {
        if (file.type !== 'company-registration-certificate') {
            throw new exceptions_1.DocumentMissiongException();
        }
        const studio = await this.studioService.findById(id);
        if (!studio) {
            throw new kernel_1.EntityNotFoundException();
        }
        await this.studioService.uploadDocument(studio, file._id);
        await this.fileService.addRef(file._id, {
            itemId: studio._id,
            itemType: 'studio-document'
        });
        await this.queueEventService.publish({
            channel: services_2.MEDIA_FILE_CHANNEL,
            eventName: services_2.FILE_EVENT.FILE_RELATED_MODULE_UPDATED,
            data: {
                type: services_2.DELETE_FILE_TYPE.FILEID,
                currentFile: studio.documentVerificationId,
                newFile: file._id
            }
        });
        const jwtToken = request.headers.authorization;
        return kernel_1.DataResponse.ok({
            file,
            url: jwtToken
                ? `${file_1.FileDto.getPublicUrl(file.path)}?documentId=${file._id}&token=${jwtToken}`
                : file_1.FileDto.getPublicUrl(file.path)
        });
    }
    async adminUpdate(payload, id) {
        await this.studioService.update(id, payload);
        const studio = await this.studioService.findById(id);
        if (payload.documentVerificationId) {
            await this.fileService.addRef(payload.documentVerificationId, {
                itemId: studio._id,
                itemType: 'studio-document'
            });
        }
        return kernel_1.DataResponse.ok(new dtos_3.StudioDto(studio).toResponse(true));
    }
    async addMember(payload, currentStudio) {
        const performer = await this.performerService.create(Object.assign(Object.assign({}, payload), { studioId: currentStudio._id }));
        const event = {
            channel: 'STUDIO_MEMBER_CHANNEL',
            eventName: constants_1.EVENT.CREATED,
            data: { studioId: currentStudio._id }
        };
        await this.queueEventService.publish(event);
        return kernel_1.DataResponse.ok(new dtos_1.PerformerDto(performer).toResponse());
    }
    async removeMember(id, currentStudio) {
        const performer = await this.performerService.findOne({ _id: id });
        if (!performer) {
            throw new kernel_1.EntityNotFoundException();
        }
        if (currentStudio._id !== performer.studioId) {
            throw new kernel_1.ForbiddenException();
        }
        performer.set('studioId', null);
        await performer.save();
        await this.queueEventService.publish({
            channel: 'STUDIO_MEMBER_CHANNEL',
            eventName: constants_1.EVENT.UPDATED,
            data: { studioId: currentStudio._id, total: -1 }
        });
        return kernel_1.DataResponse.ok(new dtos_1.PerformerDto(performer).toResponse());
    }
    async updateMemberStatus(id, payload, currentStudio) {
        await this.performerService.studioUpdate(id, payload, currentStudio._id);
        const performer = await this.performerService.findById(id);
        return kernel_1.DataResponse.ok(new dtos_1.PerformerDto(performer).toResponse());
    }
    async updateMemberCommission(id, payload, currentStudio) {
        await this.performerCommissionService.studioUpdate(id, payload, currentStudio._id);
        const commission = await this.performerCommissionService.findOne({
            performerId: id
        });
        return kernel_1.DataResponse.ok(commission);
    }
    async stats(studio) {
        const results = await this.studioService.stats(studio._id);
        return kernel_1.DataResponse.ok(results);
    }
};
__decorate([
    common_1.Get('/me'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StudioController.prototype, "me", null);
__decorate([
    common_1.Get('/:id/view'),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StudioController.prototype, "detail", null);
__decorate([
    common_1.Put('/update'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('studio'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Body()),
    __param(1, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_2.StudioUpdatePayload,
        dtos_3.StudioDto]),
    __metadata("design:returntype", Promise)
], StudioController.prototype, "update", null);
__decorate([
    common_1.Get('search'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_2.StudioSearchPayload]),
    __metadata("design:returntype", Promise)
], StudioController.prototype, "search", null);
__decorate([
    common_1.Get('members'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('studio'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __param(1, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.PerformerSearchPayload,
        dtos_2.UserDto]),
    __metadata("design:returntype", Promise)
], StudioController.prototype, "members", null);
__decorate([
    common_1.Post('/register'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true
    })),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_2.StudioCreateByAdminPayload]),
    __metadata("design:returntype", Promise)
], StudioController.prototype, "register", null);
__decorate([
    common_1.Put('/documents/upload'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('studio'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UseInterceptors(file_1.FileUploadInterceptor('company-registration-certificate', 'documentVerification', {
        destination: kernel_1.getConfig('file').documentDir
    })),
    __param(0, file_1.FileUploaded()),
    __param(1, decorators_1.CurrentUser()),
    __param(2, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [file_1.FileDto,
        dtos_3.StudioDto, Object]),
    __metadata("design:returntype", Promise)
], StudioController.prototype, "updateDocumentVerification", null);
__decorate([
    common_1.Post('/documents/upload'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('admin', 'studio'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UseInterceptors(file_1.FileUploadInterceptor('company-registration-certificate', 'documentVerification', {
        destination: kernel_1.getConfig('file').documentDir
    })),
    __param(0, file_1.FileUploaded()),
    __param(1, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [file_1.FileDto, Object]),
    __metadata("design:returntype", Promise)
], StudioController.prototype, "uploadDocumentVerification", null);
__decorate([
    common_1.Put('/:id/documents/upload'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UseInterceptors(file_1.FileUploadInterceptor('company-registration-certificate', 'documentVerification', {
        destination: kernel_1.getConfig('file').documentDir
    })),
    __param(0, file_1.FileUploaded()),
    __param(1, common_1.Param('id')),
    __param(2, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [file_1.FileDto, String, Object]),
    __metadata("design:returntype", Promise)
], StudioController.prototype, "adminUpdateDocumentVerification", null);
__decorate([
    common_1.Put('/:id/update'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Body()),
    __param(1, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_2.StudioUpdatePayload, String]),
    __metadata("design:returntype", Promise)
], StudioController.prototype, "adminUpdate", null);
__decorate([
    common_1.Post('members'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('studio'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Body()),
    __param(1, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.PerformerCreatePayload,
        dtos_3.StudioDto]),
    __metadata("design:returntype", Promise)
], StudioController.prototype, "addMember", null);
__decorate([
    common_1.Delete('/members/:id'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('studio'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Param('id')),
    __param(1, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_3.StudioDto]),
    __metadata("design:returntype", Promise)
], StudioController.prototype, "removeMember", null);
__decorate([
    common_1.Post('members/:id/active'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('studio'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Body()),
    __param(2, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, payloads_2.MemberSetActivePayload,
        dtos_3.StudioDto]),
    __metadata("design:returntype", Promise)
], StudioController.prototype, "updateMemberStatus", null);
__decorate([
    common_1.Post('members/:id/commission'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('studio'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Body()),
    __param(2, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, payloads_2.UpdateCommissionPayload,
        dtos_3.StudioDto]),
    __metadata("design:returntype", Promise)
], StudioController.prototype, "updateMemberCommission", null);
__decorate([
    common_1.Get('/stats'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('studio'),
    common_1.UseGuards(guards_1.RoleGuard),
    __param(0, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_3.StudioDto]),
    __metadata("design:returntype", Promise)
], StudioController.prototype, "stats", null);
StudioController = __decorate([
    common_1.Controller('studio'),
    __metadata("design:paramtypes", [services_4.StudioService,
        services_3.PerformerService,
        services_3.PerformerSearchService,
        services_3.PerformerCommissionService,
        kernel_1.QueueEventService,
        services_1.AuthService,
        services_2.FileService])
], StudioController);
exports.StudioController = StudioController;
//# sourceMappingURL=studio.controller.js.map