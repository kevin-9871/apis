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
exports.CamAggregatorController = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const decorators_1 = require("../../auth/decorators");
const guards_1 = require("../../auth/guards");
const cam_aggregator_service_1 = require("../services/cam-aggregator.service");
let CamAggregatorController = class CamAggregatorController {
    constructor(service) {
        this.service = service;
    }
    async onlineList(req) {
        const data = await this.service.listOnline(req);
        return kernel_1.DataResponse.ok(data);
    }
    async getActiveCategories() {
        const data = await this.service.getCategories({
            active: true
        });
        return kernel_1.DataResponse.ok(data);
    }
    async getAllCategories() {
        const data = await this.service.getCategories({});
        return kernel_1.DataResponse.ok(data);
    }
    async getCategory(id) {
        const data = await this.service.getCategory(id);
        return kernel_1.DataResponse.ok(data);
    }
    async updateCategory(id, payload) {
        const data = await this.service.updateCategory(id, payload);
        return kernel_1.DataResponse.ok(data);
    }
    async getDetails(key, username) {
        const data = await this.service.getDetails(key, username);
        return kernel_1.DataResponse.ok(data);
    }
    async getDetails2(username) {
        const data = await this.service.getDetails(null, username);
        return kernel_1.DataResponse.ok(data);
    }
    async getRelatedCams(username, query) {
        const data = await this.service.getRelatedCams(username, query);
        return kernel_1.DataResponse.ok(data);
    }
};
__decorate([
    common_1.Get('online'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CamAggregatorController.prototype, "onlineList", null);
__decorate([
    common_1.Get('categories'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CamAggregatorController.prototype, "getActiveCategories", null);
__decorate([
    common_1.Get('admin/categories'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CamAggregatorController.prototype, "getAllCategories", null);
__decorate([
    common_1.Get('admin/categories/:id'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CamAggregatorController.prototype, "getCategory", null);
__decorate([
    common_1.Put('admin/categories/:id'),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CamAggregatorController.prototype, "updateCategory", null);
__decorate([
    common_1.Get('profile/:key/:username'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Param('key')),
    __param(1, common_1.Param('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CamAggregatorController.prototype, "getDetails", null);
__decorate([
    common_1.Get('profile/:username'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Param('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CamAggregatorController.prototype, "getDetails2", null);
__decorate([
    common_1.Get('/:username/related'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Param('username')),
    __param(1, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CamAggregatorController.prototype, "getRelatedCams", null);
CamAggregatorController = __decorate([
    common_1.Controller('cam-aggregator'),
    __metadata("design:paramtypes", [cam_aggregator_service_1.CamAggregatorService])
], CamAggregatorController);
exports.CamAggregatorController = CamAggregatorController;
//# sourceMappingURL=cam-aggregator.controller.js.map