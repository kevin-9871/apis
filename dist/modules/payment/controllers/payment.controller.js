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
exports.PaymentController = void 0;
const common_1 = require("@nestjs/common");
const guards_1 = require("../../auth/guards");
const kernel_1 = require("../../../kernel");
const decorators_1 = require("../../auth/decorators");
const dtos_1 = require("../../user/dtos");
const payment_service_1 = require("../services/payment.service");
const order_service_1 = require("../services/order.service");
let PaymentController = class PaymentController {
    constructor(paymentService, orderService) {
        this.paymentService = paymentService;
        this.orderService = orderService;
    }
    async purchaseProducts(user, tokenId, gateway) {
        const order = await this.orderService.createTokenOrderFromPayload(tokenId, user);
        const info = await this.paymentService.processSinglePayment(order, gateway || 'ccbill');
        return kernel_1.DataResponse.ok(info);
    }
    async ccbillCallhook(payload, req) {
        if (!['NewSaleSuccess', 'RenewalSuccess'].includes(req.eventType)) {
            return kernel_1.DataResponse.ok(false);
        }
        let info;
        const data = Object.assign(Object.assign({}, payload), req);
        switch (req.eventType) {
            case 'RenewalSuccess':
                info = await this.paymentService.ccbillRenewalSuccessWebhook(data);
                break;
            default:
                info = await this.paymentService.ccbillSinglePaymentSuccessWebhook(data);
                break;
        }
        return kernel_1.DataResponse.ok(info);
    }
};
__decorate([
    common_1.Post('/purchase-tokens/:tokenId'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('user'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, decorators_1.CurrentUser()),
    __param(1, common_1.Param('tokenId')),
    __param(2, common_1.Body('gateway')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.UserDto, Object, String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "purchaseProducts", null);
__decorate([
    common_1.Post('/ccbill/callhook'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Body()),
    __param(1, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "ccbillCallhook", null);
PaymentController = __decorate([
    common_1.Injectable(),
    common_1.Controller('payment'),
    __metadata("design:paramtypes", [payment_service_1.PaymentService,
        order_service_1.OrderService])
], PaymentController);
exports.PaymentController = PaymentController;
//# sourceMappingURL=payment.controller.js.map