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
exports.SettingFileUploadController = void 0;
const common_1 = require("@nestjs/common");
const guards_1 = require("../../auth/guards");
const kernel_1 = require("../../../kernel");
const file_1 = require("../../file");
const decorators_1 = require("../../auth/decorators");
let SettingFileUploadController = class SettingFileUploadController {
    async uploadFile(file) {
        return kernel_1.DataResponse.ok(Object.assign(Object.assign({}, file), { url: file.getUrl() }));
    }
};
__decorate([
    common_1.Post('upload'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UseInterceptors(file_1.FileUploadInterceptor('setting', 'file', {
        destination: kernel_1.getConfig('file').settingDir
    })),
    __param(0, file_1.FileUploaded()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [file_1.FileDto]),
    __metadata("design:returntype", Promise)
], SettingFileUploadController.prototype, "uploadFile", null);
SettingFileUploadController = __decorate([
    common_1.Injectable(),
    common_1.Controller('admin/settings/files')
], SettingFileUploadController);
exports.SettingFileUploadController = SettingFileUploadController;
//# sourceMappingURL=setting-file-upload.controller.js.map