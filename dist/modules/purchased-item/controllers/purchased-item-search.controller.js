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
exports.PaymentTokenSearchController = void 0;
const common_1 = require("@nestjs/common");
const guards_1 = require("../../auth/guards");
const kernel_1 = require("../../../kernel");
const decorators_1 = require("../../auth/decorators");
const dtos_1 = require("../../user/dtos");
const services_1 = require("../services");
const purchase_item_search_payload_1 = require("../payloads/purchase-item.search.payload");
const constants_1 = require("../constants");
let PaymentTokenSearchController = class PaymentTokenSearchController {
    constructor(purchasedItemSearchService) {
        this.purchasedItemSearchService = purchasedItemSearchService;
    }
    async adminTranasctions(req) {
        const data = await this.purchasedItemSearchService.adminGetUserTransactionsToken(req);
        return kernel_1.DataResponse.ok(data);
    }
    async userTranasctions(req, user) {
        const data = await this.purchasedItemSearchService.getUserTransactionsToken(req, user);
        return kernel_1.DataResponse.ok(data);
    }
    async getPurchasedVideos(req, user) {
        req.type = constants_1.PURCHASE_ITEM_TYPE.SALE_VIDEO;
        const data = await this.purchasedItemSearchService.getUserTransactionsToken(req, user);
        return kernel_1.DataResponse.ok(data);
    }
    async getPurchasedGalleries(req, user) {
        req.type = constants_1.PURCHASE_ITEM_TYPE.PHOTO;
        const data = await this.purchasedItemSearchService.getUserTransactionsToken(req, user);
        return kernel_1.DataResponse.ok(data);
    }
    async getPurchasedProducts(req, user) {
        req.type = constants_1.PURCHASE_ITEM_TYPE.PRODUCT;
        const data = await this.purchasedItemSearchService.getUserTransactionsToken(req, user);
        return kernel_1.DataResponse.ok(data);
    }
};
__decorate([
    common_1.Get('/admin/search'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [purchase_item_search_payload_1.PaymentTokenSearchPayload]),
    __metadata("design:returntype", Promise)
], PaymentTokenSearchController.prototype, "adminTranasctions", null);
__decorate([
    common_1.Get('/user/search'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('user'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __param(1, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [purchase_item_search_payload_1.PaymentTokenSearchPayload,
        dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], PaymentTokenSearchController.prototype, "userTranasctions", null);
__decorate([
    common_1.Get('/user/videos'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('user'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __param(1, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [purchase_item_search_payload_1.PaymentTokenSearchPayload,
        dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], PaymentTokenSearchController.prototype, "getPurchasedVideos", null);
__decorate([
    common_1.Get('/user/galleries'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('user'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __param(1, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [purchase_item_search_payload_1.PaymentTokenSearchPayload,
        dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], PaymentTokenSearchController.prototype, "getPurchasedGalleries", null);
__decorate([
    common_1.Get('/user/products'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('user'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __param(1, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [purchase_item_search_payload_1.PaymentTokenSearchPayload,
        dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], PaymentTokenSearchController.prototype, "getPurchasedProducts", null);
PaymentTokenSearchController = __decorate([
    common_1.Injectable(),
    common_1.Controller('purchased-items'),
    __metadata("design:paramtypes", [services_1.PurchasedItemSearchService])
], PaymentTokenSearchController);
exports.PaymentTokenSearchController = PaymentTokenSearchController;
//# sourceMappingURL=purchased-item-search.controller.js.map