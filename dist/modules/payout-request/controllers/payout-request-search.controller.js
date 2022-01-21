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
exports.PayoutRequestSearchController = void 0;
const common_1 = require("@nestjs/common");
const guards_1 = require("../../auth/guards");
const kernel_1 = require("../../../kernel");
const decorators_1 = require("../../auth/decorators");
const dtos_1 = require("../../user/dtos");
const payout_request_service_1 = require("../services/payout-request.service");
const payout_request_payload_1 = require("../payloads/payout-request.payload");
let PayoutRequestSearchController = class PayoutRequestSearchController {
    constructor(payoutRequestService) {
        this.payoutRequestService = payoutRequestService;
    }
    async adminSearch(req, user) {
        const data = await this.payoutRequestService.search(req, user);
        return kernel_1.DataResponse.ok(data);
    }
    async studioSearch(req, user) {
        req.sourceId = user._id.toString();
        req.sourceType = 'studio';
        const data = await this.payoutRequestService.search(req);
        return kernel_1.DataResponse.ok(data);
    }
    async performerSearch(req, user) {
        req.sourceId = user._id.toString();
        req.sourceType = 'performer';
        const data = await this.payoutRequestService.search(req);
        return kernel_1.DataResponse.ok(data);
    }
};
__decorate([
    common_1.Get('/search'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __param(1, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payout_request_payload_1.PayoutRequestSearchPayload,
        dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], PayoutRequestSearchController.prototype, "adminSearch", null);
__decorate([
    common_1.Get('/studio/search'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('studio'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __param(1, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payout_request_payload_1.PayoutRequestSearchPayload,
        dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], PayoutRequestSearchController.prototype, "studioSearch", null);
__decorate([
    common_1.Get('/performer/search'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('performer'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __param(1, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payout_request_payload_1.PayoutRequestSearchPayload,
        dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], PayoutRequestSearchController.prototype, "performerSearch", null);
PayoutRequestSearchController = __decorate([
    common_1.Injectable(),
    common_1.Controller('payout-requests'),
    __metadata("design:paramtypes", [payout_request_service_1.PayoutRequestService])
], PayoutRequestSearchController);
exports.PayoutRequestSearchController = PayoutRequestSearchController;
//# sourceMappingURL=payout-request-search.controller.js.map