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
exports.OrderController = void 0;
const common_1 = require("@nestjs/common");
const guards_1 = require("../../auth/guards");
const kernel_1 = require("../../../kernel");
const decorators_1 = require("../../auth/decorators");
const dtos_1 = require("../../user/dtos");
const payloads_1 = require("../payloads");
const order_search_service_1 = require("../services/order-search.service");
const services_1 = require("../services");
const order_update_payload_1 = require("../payloads/order-update.payload");
let OrderController = class OrderController {
    constructor(orderSearchService, orderService) {
        this.orderSearchService = orderSearchService;
        this.orderService = orderService;
    }
    async userGetOrderDetails(orderId, user) {
        var _a;
        const item = await this.orderService.findById(orderId);
        if (((_a = item === null || item === void 0 ? void 0 : item.buyerId) === null || _a === void 0 ? void 0 : _a.toString()) !== user._id.toString()) {
            throw new common_1.ForbiddenException();
        }
        const response = await this.orderService.getDetails(orderId);
        return kernel_1.DataResponse.ok(response);
    }
    async getOrderDetails(orderId, user) {
        var _a, _b;
        const item = await this.orderService.findById(orderId);
        if (!((_a = user.roles) === null || _a === void 0 ? void 0 : _a.includes('admin')) && ((_b = item === null || item === void 0 ? void 0 : item.sellerId) === null || _b === void 0 ? void 0 : _b.toString()) !== user._id.toString()) {
            throw new common_1.ForbiddenException();
        }
        const response = await this.orderService.getDetails(orderId);
        return kernel_1.DataResponse.ok(response);
    }
    async getUserOrders(req, user) {
        req.buyerId = user._id;
        const response = await this.orderSearchService.search(req);
        return kernel_1.DataResponse.ok(response);
    }
    async search(req, user) {
        var _a;
        if (!((_a = user.roles) === null || _a === void 0 ? void 0 : _a.includes('admin'))) {
            req.sellerId = user._id;
        }
        const response = await this.orderSearchService.search(req);
        return kernel_1.DataResponse.ok(response);
    }
    async update(orderId, payload, user) {
        var _a, _b;
        const item = await this.orderService.findById(orderId);
        if (!((_a = user.roles) === null || _a === void 0 ? void 0 : _a.includes('admin')) && ((_b = item === null || item === void 0 ? void 0 : item.sellerId) === null || _b === void 0 ? void 0 : _b.toString()) !== user._id.toString()) {
            throw new common_1.ForbiddenException();
        }
        const response = await this.orderService.update(orderId, payload);
        return kernel_1.DataResponse.ok(response);
    }
};
__decorate([
    common_1.Get('/user/details/:id'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('user'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Param('id')),
    __param(1, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "userGetOrderDetails", null);
__decorate([
    common_1.Get('/details/:id'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('performer', 'admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Param('id')),
    __param(1, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getOrderDetails", null);
__decorate([
    common_1.Get('/user/search'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('user'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __param(1, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.OrderSearchPayload,
        dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getUserOrders", null);
__decorate([
    common_1.Get('/search'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('admin', 'performer'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __param(1, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.OrderSearchPayload,
        dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "search", null);
__decorate([
    common_1.Put('/:id/update'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('admin', 'performer'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Body()),
    __param(2, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, order_update_payload_1.OrderUpdatePayload,
        dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "update", null);
OrderController = __decorate([
    common_1.Injectable(),
    common_1.Controller('orders'),
    __metadata("design:paramtypes", [order_search_service_1.OrderSearchService,
        services_1.OrderService])
], OrderController);
exports.OrderController = OrderController;
//# sourceMappingURL=order.controller.js.map