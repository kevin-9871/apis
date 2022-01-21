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
exports.AdminCategoryController = void 0;
const common_1 = require("@nestjs/common");
const guards_1 = require("../../auth/guards");
const kernel_1 = require("../../../kernel");
const decorators_1 = require("../../auth/decorators");
const dtos_1 = require("../../user/dtos");
const services_1 = require("../services");
const payloads_1 = require("../payloads");
let AdminCategoryController = class AdminCategoryController {
    constructor(categoryService) {
        this.categoryService = categoryService;
    }
    async create(currentUser, payload) {
        const category = await this.categoryService.create(payload, currentUser);
        return kernel_1.DataResponse.ok(category);
    }
    async update(id, currentUser, payload) {
        const category = await this.categoryService.update(id, payload, currentUser);
        return kernel_1.DataResponse.ok(category);
    }
    async delete(id) {
        await this.categoryService.delete(id);
        return kernel_1.DataResponse.ok(true);
    }
};
__decorate([
    common_1.Post(),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, decorators_1.CurrentUser()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.UserDto,
        payloads_1.CategoryCreatePayload]),
    __metadata("design:returntype", Promise)
], AdminCategoryController.prototype, "create", null);
__decorate([
    common_1.Put('/:id'),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Param('id')),
    __param(1, decorators_1.CurrentUser()),
    __param(2, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.UserDto,
        payloads_1.CategoryUpdatePayload]),
    __metadata("design:returntype", Promise)
], AdminCategoryController.prototype, "update", null);
__decorate([
    common_1.Delete('/:id'),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminCategoryController.prototype, "delete", null);
AdminCategoryController = __decorate([
    common_1.Injectable(),
    common_1.Controller('admin/post-categories'),
    __metadata("design:paramtypes", [services_1.CategoryService])
], AdminCategoryController);
exports.AdminCategoryController = AdminCategoryController;
//# sourceMappingURL=admin-category.controller.js.map