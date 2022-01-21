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
exports.StudioCommissionController = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const decorators_1 = require("../../auth/decorators");
const guards_1 = require("../../auth/guards");
const payloads_1 = require("../../performer/payloads");
const dtos_1 = require("../dtos");
const payloads_2 = require("../payloads");
const commission_service_1 = require("../services/commission.service");
let StudioCommissionController = class StudioCommissionController {
    constructor(studioCommissionService) {
        this.studioCommissionService = studioCommissionService;
    }
    async search(payload, user) {
        const results = await this.studioCommissionService.searchMemberCommissions(Object.assign(Object.assign({}, payload), { studioId: user._id.toString() }), user);
        return kernel_1.DataResponse.ok(results);
    }
    async updateMemberCommission(id, payload, studio) {
        const results = await this.studioCommissionService.studioUpdateMemberCommission(id, payload, studio);
        return kernel_1.DataResponse.ok(results);
    }
    async update(id, payload) {
        const results = await this.studioCommissionService.adminUpdateStudioCommission(id, payload);
        return kernel_1.DataResponse.ok(results);
    }
};
__decorate([
    common_1.Get('/'),
    decorators_1.Roles('studio'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __param(1, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.PerformerSearchPayload,
        dtos_1.StudioDto]),
    __metadata("design:returntype", Promise)
], StudioCommissionController.prototype, "search", null);
__decorate([
    common_1.Put('/member/:id'),
    decorators_1.Roles('studio'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Body()),
    __param(2, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, payloads_2.UpdateCommissionPayload,
        dtos_1.StudioDto]),
    __metadata("design:returntype", Promise)
], StudioCommissionController.prototype, "updateMemberCommission", null);
__decorate([
    common_1.Put('/:id'),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, payloads_2.UpdateCommissionPayload]),
    __metadata("design:returntype", Promise)
], StudioCommissionController.prototype, "update", null);
StudioCommissionController = __decorate([
    common_1.Controller('studio/commission'),
    __metadata("design:paramtypes", [commission_service_1.StudioCommissionService])
], StudioCommissionController);
exports.StudioCommissionController = StudioCommissionController;
//# sourceMappingURL=commissions.controller.js.map