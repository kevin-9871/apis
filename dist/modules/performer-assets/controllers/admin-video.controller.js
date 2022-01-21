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
exports.AdminPerformerVideosController = void 0;
const common_1 = require("@nestjs/common");
const guards_1 = require("../../auth/guards");
const kernel_1 = require("../../../kernel");
const decorators_1 = require("../../auth/decorators");
const file_1 = require("../../file");
const dtos_1 = require("../../performer/dtos");
const video_create_payload_1 = require("../payloads/video-create.payload");
const video_service_1 = require("../services/video.service");
const payloads_1 = require("../payloads");
const video_search_service_1 = require("../services/video-search.service");
let AdminPerformerVideosController = class AdminPerformerVideosController {
    constructor(videoService, videoSearchService) {
        this.videoService = videoService;
        this.videoSearchService = videoSearchService;
    }
    async uploadVideo(files, payload) {
        const resp = await this.videoService.create(files.video, files.trailer, files.thumbnail, payload);
        return kernel_1.DataResponse.ok(resp);
    }
    async details(id, req) {
        const details = await this.videoService.getDetails(id, req.jwToken);
        return kernel_1.DataResponse.ok(details);
    }
    async search(req, request) {
        const resp = await this.videoSearchService.adminSearch(req, request.jwToken);
        return kernel_1.DataResponse.ok(resp);
    }
    async update(id, payload, updater, files) {
        const details = await this.videoService.updateInfo(id, payload, files.video, files.trailer, files.thumbnail, updater);
        return kernel_1.DataResponse.ok(details);
    }
    async remove(id) {
        const details = await this.videoService.delete(id);
        return kernel_1.DataResponse.ok(details);
    }
};
__decorate([
    common_1.Post('/upload'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UseInterceptors(file_1.MultiFileUploadInterceptor([
        {
            type: 'performer-video',
            fieldName: 'video',
            options: {
                destination: kernel_1.getConfig('file').videoProtectedDir
            }
        },
        {
            type: 'performer-trailer-video',
            fieldName: 'trailer',
            options: {
                destination: kernel_1.getConfig('file').videoDir
            }
        },
        {
            type: 'performer-video-thumbnail',
            fieldName: 'thumbnail',
            options: {
                destination: kernel_1.getConfig('file').imageDir,
                generateThumbnail: true,
                replaceWithThumbail: true,
                thumbnailSize: kernel_1.getConfig('image').videoThumbnail
            }
        }
    ], {})),
    __param(0, file_1.FilesUploaded()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, video_create_payload_1.VideoCreatePayload]),
    __metadata("design:returntype", Promise)
], AdminPerformerVideosController.prototype, "uploadVideo", null);
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
], AdminPerformerVideosController.prototype, "details", null);
__decorate([
    common_1.Get('/search'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    __param(0, common_1.Query()),
    __param(1, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.VideoSearchRequest, Object]),
    __metadata("design:returntype", Promise)
], AdminPerformerVideosController.prototype, "search", null);
__decorate([
    common_1.Put('/:id'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UseInterceptors(file_1.MultiFileUploadInterceptor([
        {
            type: 'performer-video',
            fieldName: 'video',
            options: {
                destination: kernel_1.getConfig('file').videoProtectedDir
            }
        },
        {
            type: 'performer-trailer-video',
            fieldName: 'trailer',
            options: {
                destination: kernel_1.getConfig('file').videoDir
            }
        },
        {
            type: 'performer-video-thumbnail',
            fieldName: 'thumbnail',
            options: {
                destination: kernel_1.getConfig('file').imageDir,
                generateThumbnail: true,
                replaceWithThumbail: true,
                thumbnailSize: kernel_1.getConfig('image').videoThumbnail
            }
        }
    ], {})),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Body()),
    __param(2, decorators_1.CurrentUser()),
    __param(3, file_1.FilesUploaded()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, payloads_1.VideoUpdatePayload,
        dtos_1.PerformerDto, Object]),
    __metadata("design:returntype", Promise)
], AdminPerformerVideosController.prototype, "update", null);
__decorate([
    common_1.Delete('/:id'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminPerformerVideosController.prototype, "remove", null);
AdminPerformerVideosController = __decorate([
    common_1.Injectable(),
    common_1.Controller('admin/performer-assets/videos'),
    __metadata("design:paramtypes", [video_service_1.VideoService,
        video_search_service_1.VideoSearchService])
], AdminPerformerVideosController);
exports.AdminPerformerVideosController = AdminPerformerVideosController;
//# sourceMappingURL=admin-video.controller.js.map