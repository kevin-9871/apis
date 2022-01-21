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
exports.MemberPaymentToken = void 0;
const common_1 = require("@nestjs/common");
const guards_1 = require("../../auth/guards");
const decorators_1 = require("../../auth/decorators");
const kernel_1 = require("../../../kernel");
const dtos_1 = require("../../user/dtos");
const payloads_1 = require("../payloads");
const services_1 = require("../services");
let MemberPaymentToken = class MemberPaymentToken {
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    async sendTips(user, id, payload) {
        const data = await this.paymentService.sendTips(user, id, payload);
        return kernel_1.DataResponse.ok(data);
    }
    async sendPaidToken(user, id) {
        const info = await this.paymentService.sendPaidToken(user, id);
        return kernel_1.DataResponse.ok(info);
    }
};
__decorate([
    common_1.Post('/send-tip-token/:id'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('user'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, decorators_1.CurrentUser()),
    __param(1, common_1.Param('id')),
    __param(2, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.UserDto, String, payloads_1.SendTipsPayload]),
    __metadata("design:returntype", Promise)
], MemberPaymentToken.prototype, "sendTips", null);
__decorate([
    common_1.Post('/send-pay-token/:id'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('user'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, decorators_1.CurrentUser()),
    __param(1, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.UserDto, String]),
    __metadata("design:returntype", Promise)
], MemberPaymentToken.prototype, "sendPaidToken", null);
MemberPaymentToken = __decorate([
    common_1.Injectable(),
    common_1.Controller('member'),
    __metadata("design:paramtypes", [services_1.PurchaseItemService])
], MemberPaymentToken);
exports.MemberPaymentToken = MemberPaymentToken;
//# sourceMappingURL=member.controller.js.map