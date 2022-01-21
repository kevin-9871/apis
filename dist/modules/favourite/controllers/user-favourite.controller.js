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
exports.UserFavouriteController = void 0;
const common_1 = require("@nestjs/common");
const decorators_1 = require("../../auth/decorators");
const dtos_1 = require("../../user/dtos");
const kernel_1 = require("../../../kernel");
const guards_1 = require("../../auth/guards");
const services_1 = require("../services");
const payload_1 = require("../payload");
let UserFavouriteController = class UserFavouriteController {
    constructor(favouriteService) {
        this.favouriteService = favouriteService;
    }
    async like(id, user) {
        const data = await this.favouriteService.doLike(id, user._id);
        return kernel_1.DataResponse.ok(data);
    }
    async unlike(id, user) {
        const data = await this.favouriteService.doUnlike(id, user._id);
        return kernel_1.DataResponse.ok(data);
    }
    async userSearch(req, user) {
        const data = await this.favouriteService.userSearch(req, user);
        return kernel_1.DataResponse.ok(data);
    }
};
__decorate([
    common_1.Post('/:id/like'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('user'),
    common_1.UseGuards(guards_1.RoleGuard),
    __param(0, common_1.Param('id')),
    __param(1, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], UserFavouriteController.prototype, "like", null);
__decorate([
    common_1.Post('/:id/unlike'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('user'),
    common_1.UseGuards(guards_1.RoleGuard),
    __param(0, common_1.Param('id')),
    __param(1, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], UserFavouriteController.prototype, "unlike", null);
__decorate([
    common_1.Get('/'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('user'),
    common_1.UseGuards(guards_1.RoleGuard),
    __param(0, common_1.Query()),
    __param(1, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payload_1.FavouriteSearchPayload,
        dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], UserFavouriteController.prototype, "userSearch", null);
UserFavouriteController = __decorate([
    common_1.Injectable(),
    common_1.Controller('favourite'),
    __metadata("design:paramtypes", [services_1.FavouriteService])
], UserFavouriteController);
exports.UserFavouriteController = UserFavouriteController;
//# sourceMappingURL=user-favourite.controller.js.map