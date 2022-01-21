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
exports.EarningController = void 0;
const common_1 = require("@nestjs/common");
const guards_1 = require("../../auth/guards");
const kernel_1 = require("../../../kernel");
const decorators_1 = require("../../auth/decorators");
const dtos_1 = require("../../studio/dtos");
const earning_service_1 = require("../services/earning.service");
const payloads_1 = require("../payloads");
const dtos_2 = require("../../user/dtos");
let EarningController = class EarningController {
    constructor(earningService) {
        this.earningService = earningService;
    }
    async adminSearch(req, user) {
        const data = await this.earningService.search(req, user);
        return kernel_1.DataResponse.ok(data);
    }
    async search(req, performer) {
        req.targetId = performer._id.toString();
        const data = await this.earningService.search(req);
        return kernel_1.DataResponse.ok(data);
    }
    async studioSearch(req, studio) {
        req.targetId = studio._id.toString();
        const data = await this.earningService.search(req);
        return kernel_1.DataResponse.ok(data);
    }
    async adminStats(req) {
        const data = await this.earningService.adminStats(req);
        return kernel_1.DataResponse.ok(data);
    }
    async performerStats(req, user) {
        req.targetId = user._id.toString();
        const data = await this.earningService.stats(req);
        return kernel_1.DataResponse.ok(data);
    }
    async studioStats(req, studio) {
        req.targetId = studio._id.toString();
        const data = await this.earningService.stats(req);
        return kernel_1.DataResponse.ok(data);
    }
    async performerPayout(req, user) {
        req.targetId = user._id.toString();
        const data = await this.earningService.calculatePayoutRequestStats(req);
        return kernel_1.DataResponse.ok(data);
    }
    async studioPayout(req, studio) {
        req.targetId = studio._id.toString();
        const data = await this.earningService.calculatePayoutRequestStats(req);
        return kernel_1.DataResponse.ok(data);
    }
    async updateStats(payload) {
        const data = await this.earningService.updatePaidStatus(payload);
        return kernel_1.DataResponse.ok(data);
    }
    async details(id) {
        const data = await this.earningService.details(id);
        return kernel_1.DataResponse.ok(data);
    }
};
__decorate([
    common_1.Get('/admin/search'),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __param(1, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.EarningSearchRequestPayload,
        dtos_2.UserDto]),
    __metadata("design:returntype", Promise)
], EarningController.prototype, "adminSearch", null);
__decorate([
    common_1.Get('/performer/search'),
    decorators_1.Roles('performer'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __param(1, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.EarningSearchRequestPayload,
        dtos_2.UserDto]),
    __metadata("design:returntype", Promise)
], EarningController.prototype, "search", null);
__decorate([
    common_1.Get('/studio/search'),
    decorators_1.Roles('studio'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __param(1, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.EarningSearchRequestPayload,
        dtos_1.StudioDto]),
    __metadata("design:returntype", Promise)
], EarningController.prototype, "studioSearch", null);
__decorate([
    common_1.Get('/admin/stats'),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.EarningSearchRequestPayload]),
    __metadata("design:returntype", Promise)
], EarningController.prototype, "adminStats", null);
__decorate([
    common_1.Get('/performer/stats'),
    decorators_1.Roles('performer'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __param(1, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.EarningSearchRequestPayload,
        dtos_2.UserDto]),
    __metadata("design:returntype", Promise)
], EarningController.prototype, "performerStats", null);
__decorate([
    common_1.Get('/studio/stats'),
    decorators_1.Roles('studio'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __param(1, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.EarningSearchRequestPayload,
        dtos_1.StudioDto]),
    __metadata("design:returntype", Promise)
], EarningController.prototype, "studioStats", null);
__decorate([
    common_1.Get('/performer/payout'),
    decorators_1.Roles('performer'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __param(1, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.EarningSearchRequestPayload,
        dtos_2.UserDto]),
    __metadata("design:returntype", Promise)
], EarningController.prototype, "performerPayout", null);
__decorate([
    common_1.Get('/studio/payout'),
    decorators_1.Roles('studio'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __param(1, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.EarningSearchRequestPayload,
        dtos_1.StudioDto]),
    __metadata("design:returntype", Promise)
], EarningController.prototype, "studioPayout", null);
__decorate([
    common_1.Post('/admin/update-status'),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EarningController.prototype, "updateStats", null);
__decorate([
    common_1.Get('/:id'),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EarningController.prototype, "details", null);
EarningController = __decorate([
    common_1.Injectable(),
    common_1.Controller('earning'),
    __metadata("design:paramtypes", [earning_service_1.EarningService])
], EarningController);
exports.EarningController = EarningController;
//# sourceMappingURL=earning.controller.js.map