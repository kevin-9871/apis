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
exports.TokenPackageController = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const services_1 = require("../services");
const dtos_1 = require("../dtos");
const payloads_1 = require("../payloads");
let TokenPackageController = class TokenPackageController {
    constructor(tokenPackageService, tokenPackageSearchService) {
        this.tokenPackageService = tokenPackageService;
        this.tokenPackageSearchService = tokenPackageSearchService;
    }
    async search(req) {
        const data = await this.tokenPackageSearchService.userSearch(req);
        return kernel_1.DataResponse.ok({
            total: data.total,
            data: data.data.map((p) => new dtos_1.TokenPackageDto(p).toResponse())
        });
    }
};
__decorate([
    common_1.Get('/token/search'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.TokenPackageSearchPayload]),
    __metadata("design:returntype", Promise)
], TokenPackageController.prototype, "search", null);
TokenPackageController = __decorate([
    common_1.Injectable(),
    common_1.Controller('package'),
    __metadata("design:paramtypes", [services_1.TokenPackageService,
        services_1.TokenPackageSearchService])
], TokenPackageController);
exports.TokenPackageController = TokenPackageController;
//# sourceMappingURL=token-package.controller.js.map