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
exports.AdminPostController = void 0;
const common_1 = require("@nestjs/common");
const guards_1 = require("../../auth/guards");
const kernel_1 = require("../../../kernel");
const decorators_1 = require("../../auth/decorators");
const dtos_1 = require("../../user/dtos");
const file_1 = require("../../file");
const payloads_1 = require("../payloads");
const services_1 = require("../services");
let AdminPostController = class AdminPostController {
    constructor(postService, postSearchService) {
        this.postService = postService;
        this.postSearchService = postSearchService;
    }
    async create(currentUser, payload) {
        const post = await this.postService.create(payload, currentUser);
        return kernel_1.DataResponse.ok(post);
    }
    async update(currentUser, payload, id) {
        const post = await this.postService.update(id, payload, currentUser);
        return kernel_1.DataResponse.ok(post);
    }
    async delete(currentUser, payload, id) {
        const post = await this.postService.delete(id);
        return kernel_1.DataResponse.ok(post);
    }
    async uploadImage(user, file) {
        return kernel_1.DataResponse.ok(Object.assign(Object.assign({ success: true }, file), { url: file.getUrl() }));
    }
    async adminSearch(currentUser, req) {
        const post = await this.postSearchService.adminSearch(req);
        return kernel_1.DataResponse.ok(post);
    }
    async adminGetDetails(currentUser, id) {
        const post = await this.postService.adminGetDetails(id);
        return kernel_1.DataResponse.ok(post);
    }
};
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
        payloads_1.PostCreatePayload]),
    __metadata("design:returntype", Promise)
], AdminPostController.prototype, "create", null);
__decorate([
    common_1.Put('/:id'),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, decorators_1.CurrentUser()),
    __param(1, common_1.Body()),
    __param(2, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.UserDto,
        payloads_1.PostUpdatePayload, String]),
    __metadata("design:returntype", Promise)
], AdminPostController.prototype, "update", null);
__decorate([
    common_1.Delete('/:id'),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, decorators_1.CurrentUser()),
    __param(1, common_1.Body()),
    __param(2, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.UserDto,
        payloads_1.PostUpdatePayload, String]),
    __metadata("design:returntype", Promise)
], AdminPostController.prototype, "delete", null);
__decorate([
    common_1.Post('images/upload'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UseInterceptors(file_1.FileUploadInterceptor('image', 'image', {
        destination: kernel_1.getConfig('file').imageDir
    })),
    __param(0, decorators_1.CurrentUser()),
    __param(1, file_1.FileUploaded()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.UserDto,
        file_1.FileDto]),
    __metadata("design:returntype", Promise)
], AdminPostController.prototype, "uploadImage", null);
__decorate([
    common_1.Get('/search'),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, decorators_1.CurrentUser()),
    __param(1, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.UserDto,
        payloads_1.AdminSearch]),
    __metadata("design:returntype", Promise)
], AdminPostController.prototype, "adminSearch", null);
__decorate([
    common_1.Get('/:id/view'),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, decorators_1.CurrentUser()),
    __param(1, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.UserDto, String]),
    __metadata("design:returntype", Promise)
], AdminPostController.prototype, "adminGetDetails", null);
AdminPostController = __decorate([
    common_1.Injectable(),
    common_1.Controller('admin/posts'),
    __metadata("design:paramtypes", [services_1.PostService,
        services_1.PostSearchService])
], AdminPostController);
exports.AdminPostController = AdminPostController;
//# sourceMappingURL=admin-post.controller.js.map