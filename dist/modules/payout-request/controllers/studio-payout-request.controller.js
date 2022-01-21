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
exports.StudioPayoutRequestController = void 0;
const common_1 = require("@nestjs/common");
const guards_1 = require("../../auth/guards");
const kernel_1 = require("../../../kernel");
const decorators_1 = require("../../auth/decorators");
const dtos_1 = require("../../studio/dtos");
const services_1 = require("../../performer/services");
const dtos_2 = require("../../user/dtos");
const payout_request_payload_1 = require("../payloads/payout-request.payload");
const services_2 = require("../services");
const payout_request_dto_1 = require("../dtos/payout-request.dto");
let StudioPayoutRequestController = class StudioPayoutRequestController {
    constructor(payoutRequestService, memberPayoutRequestService, performerService) {
        this.payoutRequestService = payoutRequestService;
        this.memberPayoutRequestService = memberPayoutRequestService;
        this.performerService = performerService;
    }
    async create(payload, user) {
        const data = await this.payoutRequestService.create(payload, user);
        return kernel_1.DataResponse.ok(data);
    }
    async update(id, payload, studio) {
        const data = await this.payoutRequestService.update(id, payload, studio);
        return kernel_1.DataResponse.ok(data);
    }
    async details(id, user) {
        const data = await this.payoutRequestService.details(id, user);
        return kernel_1.DataResponse.ok(data);
    }
    async adminDetails(id) {
        const data = await this.payoutRequestService.adminDetails(id);
        return kernel_1.DataResponse.ok(data);
    }
    async perfomrerRequest(payload, studio) {
        const results = await this.payoutRequestService.performerRequest(payload, studio);
        return kernel_1.DataResponse.ok(results);
    }
    async updateMemberRequest(id, payload, studio) {
        const request = await this.memberPayoutRequestService.updateStatus(id, payload, studio);
        return kernel_1.DataResponse.ok(new payout_request_dto_1.PayoutRequestDto(request));
    }
};
__decorate([
    common_1.Post('/'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('studio'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Body()),
    __param(1, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payout_request_payload_1.PayoutRequestCreatePayload,
        dtos_1.StudioDto]),
    __metadata("design:returntype", Promise)
], StudioPayoutRequestController.prototype, "create", null);
__decorate([
    common_1.Put('/:id'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('studio'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Body()),
    __param(2, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, payout_request_payload_1.PayoutRequestCreatePayload,
        dtos_1.StudioDto]),
    __metadata("design:returntype", Promise)
], StudioPayoutRequestController.prototype, "update", null);
__decorate([
    common_1.Get('/:id/view'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('studio'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Param('id')),
    __param(1, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.StudioDto]),
    __metadata("design:returntype", Promise)
], StudioPayoutRequestController.prototype, "details", null);
__decorate([
    common_1.Get('/admin/:id'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudioPayoutRequestController.prototype, "adminDetails", null);
__decorate([
    common_1.Get('/performer-request'),
    decorators_1.Roles('studio'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __param(1, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payout_request_payload_1.PayoutRequestSearchPayload,
        dtos_1.StudioDto]),
    __metadata("design:returntype", Promise)
], StudioPayoutRequestController.prototype, "perfomrerRequest", null);
__decorate([
    common_1.Put('/update/:id'),
    decorators_1.Roles('studio'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Body()),
    __param(2, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, payout_request_payload_1.PayoutRequestUpdatePayload,
        dtos_2.UserDto]),
    __metadata("design:returntype", Promise)
], StudioPayoutRequestController.prototype, "updateMemberRequest", null);
StudioPayoutRequestController = __decorate([
    common_1.Injectable(),
    common_1.Controller('payout-requests/studio'),
    __metadata("design:paramtypes", [services_2.StudioPayoutRequestService,
        services_2.PayoutRequestService,
        services_1.PerformerService])
], StudioPayoutRequestController);
exports.StudioPayoutRequestController = StudioPayoutRequestController;
//# sourceMappingURL=studio-payout-request.controller.js.map