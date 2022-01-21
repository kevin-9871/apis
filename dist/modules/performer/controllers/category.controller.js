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
exports.CategoryController = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const services_1 = require("../services");
const payloads_1 = require("../payloads");
const dtos_1 = require("../dtos");
let CategoryController = class CategoryController {
    constructor(categorySearchService, categoryService) {
        this.categorySearchService = categorySearchService;
        this.categoryService = categoryService;
    }
    async getList(req) {
        const list = await this.categorySearchService.search(req);
        return kernel_1.DataResponse.ok(list);
    }
    async details(id) {
        const category = await this.categoryService.findByIdOrSlug(id);
        if (!category) {
            throw new kernel_1.EntityNotFoundException();
        }
        return kernel_1.DataResponse.ok(new dtos_1.PerformerCategoryDto(category));
    }
};
__decorate([
    common_1.Get('/'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.CategorySearchRequestPayload]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "getList", null);
__decorate([
    common_1.Get('/:id/view'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "details", null);
CategoryController = __decorate([
    common_1.Injectable(),
    common_1.Controller('performer-categories'),
    __metadata("design:paramtypes", [services_1.CategorySearchService,
        services_1.CategoryService])
], CategoryController);
exports.CategoryController = CategoryController;
//# sourceMappingURL=category.controller.js.map