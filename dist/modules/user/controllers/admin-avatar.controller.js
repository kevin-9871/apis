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
exports.AdminAvatarController = void 0;
const common_1 = require("@nestjs/common");
const guards_1 = require("../../auth/guards");
const kernel_1 = require("../../../kernel");
const file_1 = require("../../file");
const decorators_1 = require("../../auth/decorators");
const dtos_1 = require("../dtos");
const services_1 = require("../services");
let AdminAvatarController = class AdminAvatarController {
    constructor(userService) {
        this.userService = userService;
    }
    async uploadUserAvatar(userId, file) {
        const user = await this.userService.findById(userId);
        if (!user) {
            throw new kernel_1.EntityNotFoundException();
        }
        await this.userService.updateAvatar(new dtos_1.UserDto(user), file);
        return kernel_1.DataResponse.ok({
            success: true,
            url: file.getUrl()
        });
    }
};
__decorate([
    common_1.Post('/:id/avatar/upload'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UseInterceptors(file_1.FileUploadInterceptor('avatar', 'avatar', {
        destination: kernel_1.getConfig('file').avatarDir,
        generateThumbnail: true,
        replaceWithThumbail: true,
        thumbnailSize: kernel_1.getConfig('image').avatar
    })),
    __param(0, common_1.Param('id')),
    __param(1, file_1.FileUploaded()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, file_1.FileDto]),
    __metadata("design:returntype", Promise)
], AdminAvatarController.prototype, "uploadUserAvatar", null);
AdminAvatarController = __decorate([
    common_1.Injectable(),
    common_1.Controller('admin/users'),
    __metadata("design:paramtypes", [services_1.UserService])
], AdminAvatarController);
exports.AdminAvatarController = AdminAvatarController;
//# sourceMappingURL=admin-avatar.controller.js.map