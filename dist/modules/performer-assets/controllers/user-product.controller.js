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
exports.UserProductsController = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const services_1 = require("../../auth/services");
const decorators_1 = require("../../auth/decorators");
const interceptors_1 = require("../../auth/interceptors");
const dtos_1 = require("../../user/dtos");
const guards_1 = require("../../auth/guards");
const services_2 = require("../../file/services");
const services_3 = require("../../purchased-item/services");
const constants_1 = require("../../purchased-item/constants");
const product_service_1 = require("../services/product.service");
const product_search_service_1 = require("../services/product-search.service");
const payloads_1 = require("../payloads");
const constants_2 = require("../constants");
let UserProductsController = class UserProductsController {
    constructor(authService, productService, productSearchService, fileService, paymentTokenService) {
        this.authService = authService;
        this.productService = productService;
        this.productSearchService = productSearchService;
        this.fileService = fileService;
        this.paymentTokenService = paymentTokenService;
    }
    async search(req, user) {
        const resp = await this.productSearchService.userSearch(req, user);
        const data = resp.data.map((d) => d.toPublic());
        return kernel_1.DataResponse.ok({
            data,
            total: resp.total
        });
    }
    async details(id) {
        const details = await this.productService.getDetails(id);
        return kernel_1.DataResponse.ok(details.toPublic());
    }
    async getDownloadLink(id, user) {
        const product = await this.productService.findById(id);
        if (!product || product.type !== constants_2.PRODUCT_TYPE.DIGITAL) {
            throw new common_1.BadRequestException('Invalid product');
        }
        const bought = await this.paymentTokenService.checkBought(product._id, constants_1.PURCHASE_ITEM_TYPE.PRODUCT, user);
        if (!bought) {
            throw new common_1.BadRequestException('Please purchase this product product');
        }
        const downloadUrl = await this.fileService.generateDownloadLink(product.digitalFileId);
        return kernel_1.DataResponse.ok({
            downloadUrl
        });
    }
    async checkAuth(request, response) {
        if (!request.query.token)
            return response.status(common_1.HttpStatus.UNAUTHORIZED).send();
        const user = await this.authService.getSourceFromJWT(request.query.token);
        if (!user) {
            return response.status(common_1.HttpStatus.UNAUTHORIZED).send();
        }
        const valid = await this.productService.checkAuth(request, user);
        return response.status(valid ? common_1.HttpStatus.OK : common_1.HttpStatus.UNAUTHORIZED).send();
    }
};
__decorate([
    common_1.Get('/search'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseInterceptors(interceptors_1.UserInterceptor),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __param(1, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.ProductSearchRequest,
        dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], UserProductsController.prototype, "search", null);
__decorate([
    common_1.Get('/:id'),
    common_1.UseGuards(guards_1.AuthGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserProductsController.prototype, "details", null);
__decorate([
    common_1.Get('/:id/download-link'),
    common_1.UseGuards(guards_1.AuthGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Param('id')),
    __param(1, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], UserProductsController.prototype, "getDownloadLink", null);
__decorate([
    common_1.Get('/auth/check'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Request()),
    __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserProductsController.prototype, "checkAuth", null);
UserProductsController = __decorate([
    common_1.Injectable(),
    common_1.Controller('user/performer-assets/products'),
    __metadata("design:paramtypes", [services_1.AuthService,
        product_service_1.ProductService,
        product_search_service_1.ProductSearchService,
        services_2.FileService,
        services_3.PaymentTokenService])
], UserProductsController);
exports.UserProductsController = UserProductsController;
//# sourceMappingURL=user-product.controller.js.map