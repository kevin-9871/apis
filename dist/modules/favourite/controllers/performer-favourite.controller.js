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
exports.PerformerFavouriteController = void 0;
const common_1 = require("@nestjs/common");
const decorators_1 = require("../../auth/decorators");
const dtos_1 = require("../../performer/dtos");
const kernel_1 = require("../../../kernel");
const guards_1 = require("../../auth/guards");
const services_1 = require("../services");
const payload_1 = require("../payload");
let PerformerFavouriteController = class PerformerFavouriteController {
    constructor(favouriteService) {
        this.favouriteService = favouriteService;
    }
    async performerSearch(req, user) {
        const data = await this.favouriteService.performerSearch(req, user);
        return kernel_1.DataResponse.ok(data);
    }
};
__decorate([
    common_1.Get('/'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('performer'),
    common_1.UseGuards(guards_1.RoleGuard),
    __param(0, common_1.Query()),
    __param(1, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payload_1.FavouriteSearchPayload,
        dtos_1.PerformerDto]),
    __metadata("design:returntype", Promise)
], PerformerFavouriteController.prototype, "performerSearch", null);
PerformerFavouriteController = __decorate([
    common_1.Injectable(),
    common_1.Controller('performer/favourite'),
    __metadata("design:paramtypes", [services_1.FavouriteService])
], PerformerFavouriteController);
exports.PerformerFavouriteController = PerformerFavouriteController;
//# sourceMappingURL=performer-favourite.controller.js.map