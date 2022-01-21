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
exports.RefundRequestController = void 0;
const common_1 = require("@nestjs/common");
const guards_1 = require("../../auth/guards");
const kernel_1 = require("../../../kernel");
const decorators_1 = require("../../auth/decorators");
const dtos_1 = require("../../user/dtos");
const refund_request_service_1 = require("../services/refund-request.service");
const refund_request_payload_1 = require("../payloads/refund-request.payload");
let RefundRequestController = class RefundRequestController {
    constructor(refundRequestService) {
        this.refundRequestService = refundRequestService;
    }
    async adminSearch(req, user) {
        const data = await this.refundRequestService.search(req, user);
        return kernel_1.DataResponse.ok(data);
    }
    async create(payload, user) {
        const data = await this.refundRequestService.create(payload, user);
        return kernel_1.DataResponse.ok(data);
    }
    async updateStatus(id, payload) {
        const data = await this.refundRequestService.updateStatus(id, payload);
        return kernel_1.DataResponse.ok(data);
    }
};
__decorate([
    common_1.Get('/search'),
    common_1.UseGuards(guards_1.AuthGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __param(1, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refund_request_payload_1.RefundRequestSearchPayload,
        dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], RefundRequestController.prototype, "adminSearch", null);
__decorate([
    common_1.Post('/'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(guards_1.AuthGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Body()),
    __param(1, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refund_request_payload_1.RefundRequestCreatePayload,
        dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], RefundRequestController.prototype, "create", null);
__decorate([
    common_1.Post('/status/:id'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, refund_request_payload_1.RefundRequestUpdatePayload]),
    __metadata("design:returntype", Promise)
], RefundRequestController.prototype, "updateStatus", null);
RefundRequestController = __decorate([
    common_1.Injectable(),
    common_1.Controller('refund-requests'),
    __metadata("design:paramtypes", [refund_request_service_1.RefundRequestService])
], RefundRequestController);
exports.RefundRequestController = RefundRequestController;
//# sourceMappingURL=refund-request.controller.js.map