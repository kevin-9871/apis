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
exports.AdminMenuController = void 0;
const common_1 = require("@nestjs/common");
const guards_1 = require("../../auth/guards");
const kernel_1 = require("../../../kernel");
const decorators_1 = require("../../auth/decorators");
const dtos_1 = require("../../user/dtos");
const services_1 = require("../services");
const payloads_1 = require("../payloads");
let AdminMenuController = class AdminMenuController {
    constructor(menuService, menuSearchService) {
        this.menuService = menuService;
        this.menuSearchService = menuSearchService;
    }
    async create(payload) {
        const menu = await this.menuService.create(payload);
        return kernel_1.DataResponse.ok(menu);
    }
    async update(id, currentUser, payload) {
        const menu = await this.menuService.update(id, payload);
        return kernel_1.DataResponse.ok(menu);
    }
    async delete(id) {
        const deleted = await this.menuService.delete(id);
        return kernel_1.DataResponse.ok(deleted);
    }
    async search(req) {
        const menu = await this.menuSearchService.search(req);
        return kernel_1.DataResponse.ok(menu);
    }
    async userSearch(req) {
        const menu = await this.menuSearchService.userSearch(req);
        return kernel_1.DataResponse.ok(menu);
    }
    async details(id) {
        const menu = await this.menuService.findById(id);
        return kernel_1.DataResponse.ok(menu);
    }
};
__decorate([
    common_1.Post('/admin'),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.MenuCreatePayload]),
    __metadata("design:returntype", Promise)
], AdminMenuController.prototype, "create", null);
__decorate([
    common_1.Put('/admin/:id'),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Param('id')),
    __param(1, decorators_1.CurrentUser()),
    __param(2, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.UserDto,
        payloads_1.MenuUpdatePayload]),
    __metadata("design:returntype", Promise)
], AdminMenuController.prototype, "update", null);
__decorate([
    common_1.Delete('/admin/:id'),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminMenuController.prototype, "delete", null);
__decorate([
    common_1.Get('/admin/search'),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.MenuSearchRequestPayload]),
    __metadata("design:returntype", Promise)
], AdminMenuController.prototype, "search", null);
__decorate([
    common_1.Get('/public'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.MenuSearchRequestPayload]),
    __metadata("design:returntype", Promise)
], AdminMenuController.prototype, "userSearch", null);
__decorate([
    common_1.Get('admin/:id/view'),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminMenuController.prototype, "details", null);
AdminMenuController = __decorate([
    common_1.Injectable(),
    common_1.Controller('menus'),
    __metadata("design:paramtypes", [services_1.MenuService,
        services_1.MenuSearchService])
], AdminMenuController);
exports.AdminMenuController = AdminMenuController;
//# sourceMappingURL=menu.controller.js.map