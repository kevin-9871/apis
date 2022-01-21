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
exports.AdminSettingController = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const decorators_1 = require("../../auth/decorators");
const services_1 = require("../services");
const guards_1 = require("../../auth/guards");
const payloads_1 = require("../payloads");
let AdminSettingController = class AdminSettingController {
    constructor(settingService) {
        this.settingService = settingService;
    }
    async getAdminSettings(group) {
        const settings = await this.settingService.getEditableSettings(group);
        return kernel_1.DataResponse.ok(settings);
    }
    async getKeyValueSettings(key) {
        const value = await this.settingService.getKeyValue(key);
        return kernel_1.DataResponse.ok(value);
    }
    async update(key, value) {
        const data = await this.settingService.update(key, value);
        return kernel_1.DataResponse.ok(data);
    }
};
__decorate([
    common_1.Get(''),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    __param(0, common_1.Query('group')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminSettingController.prototype, "getAdminSettings", null);
__decorate([
    common_1.Get('/:key'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    __param(0, common_1.Param('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminSettingController.prototype, "getKeyValueSettings", null);
__decorate([
    common_1.Put('/:key'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    __param(0, common_1.Param('key')),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, payloads_1.SettingUpdatePayload]),
    __metadata("design:returntype", Promise)
], AdminSettingController.prototype, "update", null);
AdminSettingController = __decorate([
    common_1.Injectable(),
    common_1.Controller('admin/settings'),
    __metadata("design:paramtypes", [services_1.SettingService])
], AdminSettingController);
exports.AdminSettingController = AdminSettingController;
//# sourceMappingURL=admin-setting.controller.js.map