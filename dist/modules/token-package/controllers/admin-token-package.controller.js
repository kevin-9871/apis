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
exports.AdminTokenPackageController = void 0;
const common_1 = require("@nestjs/common");
const guards_1 = require("../../auth/guards");
const kernel_1 = require("../../../kernel");
const decorators_1 = require("../../auth/decorators");
const services_1 = require("../services");
const payloads_1 = require("../payloads");
const dtos_1 = require("../dtos");
let AdminTokenPackageController = class AdminTokenPackageController {
    constructor(tokenPackageService, tokenPackageSearchService) {
        this.tokenPackageService = tokenPackageService;
        this.tokenPackageSearchService = tokenPackageSearchService;
    }
    async create(payload) {
        const tokenPackage = await this.tokenPackageService.create(payload);
        return kernel_1.DataResponse.ok(new dtos_1.TokenPackageDto(tokenPackage).toResponse());
    }
    async update(payload, id) {
        const tokenPackage = await this.tokenPackageService.update(id, payload);
        return kernel_1.DataResponse.ok(new dtos_1.TokenPackageDto(tokenPackage).toResponse());
    }
    async details(id) {
        const tokenPackage = await this.tokenPackageService.findById(id);
        return kernel_1.DataResponse.ok(new dtos_1.TokenPackageDto(tokenPackage).toResponse());
    }
    async delete(id) {
        await this.tokenPackageService.delete(id);
        return kernel_1.DataResponse.ok(true);
    }
    async adminSearch(req) {
        const data = await this.tokenPackageSearchService.search(req);
        return kernel_1.DataResponse.ok({
            total: data.total,
            data: data.data.map((p) => new dtos_1.TokenPackageDto(p).toResponse())
        });
    }
};
__decorate([
    common_1.Post('/token'),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.TokenPackageCreatePayload]),
    __metadata("design:returntype", Promise)
], AdminTokenPackageController.prototype, "create", null);
__decorate([
    common_1.Put('/token/:id'),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Body()),
    __param(1, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.TokenPackageUpdatePayload, String]),
    __metadata("design:returntype", Promise)
], AdminTokenPackageController.prototype, "update", null);
__decorate([
    common_1.Get('/token/:id/view'),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminTokenPackageController.prototype, "details", null);
__decorate([
    common_1.Delete('/token/:id'),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminTokenPackageController.prototype, "delete", null);
__decorate([
    common_1.Get('/token/search'),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.TokenPackageSearchPayload]),
    __metadata("design:returntype", Promise)
], AdminTokenPackageController.prototype, "adminSearch", null);
AdminTokenPackageController = __decorate([
    common_1.Injectable(),
    common_1.Controller('admin/package'),
    __metadata("design:paramtypes", [services_1.TokenPackageService,
        services_1.TokenPackageSearchService])
], AdminTokenPackageController);
exports.AdminTokenPackageController = AdminTokenPackageController;
//# sourceMappingURL=admin-token-package.controller.js.map