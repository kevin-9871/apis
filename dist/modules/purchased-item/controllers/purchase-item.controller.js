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
exports.PaymentTokenController = void 0;
const common_1 = require("@nestjs/common");
const guards_1 = require("../../auth/guards");
const kernel_1 = require("../../../kernel");
const decorators_1 = require("../../auth/decorators");
const payloads_1 = require("../payloads");
const dtos_1 = require("../../user/dtos");
const purchase_item_service_1 = require("../services/purchase-item.service");
let PaymentTokenController = class PaymentTokenController {
    constructor(purchaseItemService) {
        this.purchaseItemService = purchaseItemService;
    }
    async purchaseProduct(user, productId, payload) {
        const info = await this.purchaseItemService.purchaseProduct(productId, user, payload);
        return kernel_1.DataResponse.ok(info);
    }
    async purchaseVideo(user, videoId) {
        const info = await this.purchaseItemService.purchaseVideo(videoId, user);
        return kernel_1.DataResponse.ok(info);
    }
    async buyPhoto(user, id) {
        const info = await this.purchaseItemService.buyPhotoGallery(id, user);
        return kernel_1.DataResponse.ok(info);
    }
};
__decorate([
    common_1.Post('/product/:productId'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('user'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, decorators_1.CurrentUser()),
    __param(1, common_1.Param('productId')),
    __param(2, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.UserDto, Object, payloads_1.PurchaseProductsPayload]),
    __metadata("design:returntype", Promise)
], PaymentTokenController.prototype, "purchaseProduct", null);
__decorate([
    common_1.Post('/video/:videoId'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('user'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, decorators_1.CurrentUser()),
    __param(1, common_1.Param('videoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.UserDto, Object]),
    __metadata("design:returntype", Promise)
], PaymentTokenController.prototype, "purchaseVideo", null);
__decorate([
    common_1.Post('/gallery/:id'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('user'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, decorators_1.CurrentUser()),
    __param(1, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.UserDto, String]),
    __metadata("design:returntype", Promise)
], PaymentTokenController.prototype, "buyPhoto", null);
PaymentTokenController = __decorate([
    common_1.Injectable(),
    common_1.Controller('purchase-items'),
    __metadata("design:paramtypes", [purchase_item_service_1.PurchaseItemService])
], PaymentTokenController);
exports.PaymentTokenController = PaymentTokenController;
//# sourceMappingURL=purchase-item.controller.js.map