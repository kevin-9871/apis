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
exports.SettingController = void 0;
const common_1 = require("@nestjs/common");
const decorators_1 = require("../../auth/decorators");
const guards_1 = require("../../auth/guards");
const kernel_1 = require("../../../kernel");
const constants_1 = require("../constants");
const services_1 = require("../../performer/services");
const dtos_1 = require("../../performer/dtos");
const dtos_2 = require("../../studio/dtos");
const services_2 = require("../services");
let SettingController = class SettingController {
    constructor(settingService, performerCommission) {
        this.settingService = settingService;
        this.performerCommission = performerCommission;
    }
    async getPublicSettings() {
        const data = await this.settingService.getPublicSettings();
        return kernel_1.DataResponse.ok(data);
    }
    async getPerformerCommission(performer) {
        const [defaultCommission, performerCommission] = await Promise.all([
            this.settingService.getKeyValue(constants_1.SETTING_KEYS.PERFORMER_COMMISSION),
            this.performerCommission.findOne({ performerId: performer._id })
        ]);
        if (performerCommission) {
            return kernel_1.DataResponse.ok(new dtos_1.PerformerCommissionDto(performerCommission));
        }
        return kernel_1.DataResponse.ok(defaultCommission);
    }
    async getStudioCommission(studio) {
        const defaultCommission = await this.settingService.getKeyValue(constants_1.SETTING_KEYS.STUDIO_COMMISSION);
        return kernel_1.DataResponse.ok(typeof studio.commission === 'number'
            ? studio.commission
            : defaultCommission);
    }
};
__decorate([
    common_1.Get('/public'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SettingController.prototype, "getPublicSettings", null);
__decorate([
    common_1.Get('/performer/commission'),
    decorators_1.Roles('performer'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.PerformerDto]),
    __metadata("design:returntype", Promise)
], SettingController.prototype, "getPerformerCommission", null);
__decorate([
    common_1.Get('/studio/commission'),
    decorators_1.Roles('studio'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SettingController.prototype, "getStudioCommission", null);
SettingController = __decorate([
    common_1.Injectable(),
    common_1.Controller('settings'),
    __metadata("design:paramtypes", [services_2.SettingService,
        services_1.PerformerCommissionService])
], SettingController);
exports.SettingController = SettingController;
//# sourceMappingURL=setting.controller.js.map