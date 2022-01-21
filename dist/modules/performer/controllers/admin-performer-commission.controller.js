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
exports.AdminPerformerCommissionController = void 0;
const common_1 = require("@nestjs/common");
const guards_1 = require("../../auth/guards");
const kernel_1 = require("../../../kernel");
const decorators_1 = require("../../auth/decorators");
const mongodb_1 = require("mongodb");
const payloads_1 = require("../payloads");
const dtos_1 = require("../dtos");
const performer_commission_service_1 = require("../services/performer-commission.service");
let AdminPerformerCommissionController = class AdminPerformerCommissionController {
    constructor(performerCommissionService) {
        this.performerCommissionService = performerCommissionService;
    }
    async update(performerId, payload) {
        const data = await this.performerCommissionService.update(payload, performerId);
        return kernel_1.DataResponse.ok(new dtos_1.PerformerCommissionDto(data));
    }
};
__decorate([
    common_1.Put('/:performerId'),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Param('performerId')),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongodb_1.ObjectId,
        payloads_1.PerformerCommissionPayload]),
    __metadata("design:returntype", Promise)
], AdminPerformerCommissionController.prototype, "update", null);
AdminPerformerCommissionController = __decorate([
    common_1.Injectable(),
    common_1.Controller('admin/performer-commission'),
    __metadata("design:paramtypes", [performer_commission_service_1.PerformerCommissionService])
], AdminPerformerCommissionController);
exports.AdminPerformerCommissionController = AdminPerformerCommissionController;
//# sourceMappingURL=admin-performer-commission.controller.js.map