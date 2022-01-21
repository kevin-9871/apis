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
exports.PaymentInformationController = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const decorators_1 = require("../../auth/decorators");
const guards_1 = require("../../auth/guards");
const payloads_1 = require("../payloads");
const services_1 = require("../services");
let PaymentInformationController = class PaymentInformationController {
    constructor(paymentInformationService) {
        this.paymentInformationService = paymentInformationService;
    }
    async create(user, payload) {
        const result = await this.paymentInformationService.create(payload, user);
        return kernel_1.DataResponse.ok(result);
    }
    async get(user, payload) {
        const result = await this.paymentInformationService.detail(payload, user);
        return kernel_1.DataResponse.ok(result);
    }
    async adminGet(id) {
        const result = await this.paymentInformationService.adminDetail(id);
        return kernel_1.DataResponse.ok(result);
    }
    async adminUpdate(user, payload) {
        const result = await this.paymentInformationService.adminCreate(payload);
        return kernel_1.DataResponse.ok(result);
    }
    async adminSearch(user, payload) {
        const result = await this.paymentInformationService.adminSearch(payload);
        return kernel_1.DataResponse.ok(result);
    }
};
__decorate([
    common_1.Post(''),
    decorators_1.Roles('performer', 'studio'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, decorators_1.CurrentUser()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, payloads_1.PaymentInformationPayload]),
    __metadata("design:returntype", Promise)
], PaymentInformationController.prototype, "create", null);
__decorate([
    common_1.Get(''),
    decorators_1.Roles('performer', 'studio'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, decorators_1.CurrentUser()),
    __param(1, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, payloads_1.PaymentInformationPayload]),
    __metadata("design:returntype", Promise)
], PaymentInformationController.prototype, "get", null);
__decorate([
    common_1.Get('/:id/view'),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentInformationController.prototype, "adminGet", null);
__decorate([
    common_1.Post('/create'),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, decorators_1.CurrentUser()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, payloads_1.AdminCreatePaymentInformationPayload]),
    __metadata("design:returntype", Promise)
], PaymentInformationController.prototype, "adminUpdate", null);
__decorate([
    common_1.Get('/search'),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, decorators_1.CurrentUser()),
    __param(1, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, payloads_1.AdminSearchPaymentInformationPayload]),
    __metadata("design:returntype", Promise)
], PaymentInformationController.prototype, "adminSearch", null);
PaymentInformationController = __decorate([
    common_1.Controller('payment-information'),
    __metadata("design:paramtypes", [services_1.PaymentInformationService])
], PaymentInformationController);
exports.PaymentInformationController = PaymentInformationController;
//# sourceMappingURL=index.js.map