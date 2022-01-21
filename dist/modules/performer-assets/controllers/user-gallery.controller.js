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
exports.UserGalleryController = void 0;
const common_1 = require("@nestjs/common");
const interceptors_1 = require("../../auth/interceptors");
const kernel_1 = require("../../../kernel");
const services_1 = require("../../auth/services");
const decorators_1 = require("../../auth/decorators");
const dtos_1 = require("../../user/dtos");
const gallery_service_1 = require("../services/gallery.service");
const payloads_1 = require("../payloads");
let UserGalleryController = class UserGalleryController {
    constructor(galleryService, authService) {
        this.galleryService = galleryService;
        this.authService = authService;
    }
    async searchGallery(req, user, request) {
        const auth = request.authUser && { _id: request.authUser.authId, source: request.authUser.source, sourceId: request.authUser.sourceId };
        const jwToken = request.authUser && this.authService.generateJWT(auth, { expiresIn: 1 * 60 * 60 });
        const resp = await this.galleryService.userSearch(req, user, jwToken);
        return kernel_1.DataResponse.ok(resp);
    }
    async view(id, user) {
        const resp = await this.galleryService.details(id, user);
        return kernel_1.DataResponse.ok(resp);
    }
};
__decorate([
    common_1.Get('/search'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseInterceptors(interceptors_1.UserInterceptor),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __param(1, decorators_1.CurrentUser()),
    __param(2, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.GallerySearchRequest,
        dtos_1.UserDto, Object]),
    __metadata("design:returntype", Promise)
], UserGalleryController.prototype, "searchGallery", null);
__decorate([
    common_1.Get('/:id/view'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseInterceptors(interceptors_1.UserInterceptor),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Param('id')),
    __param(1, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], UserGalleryController.prototype, "view", null);
UserGalleryController = __decorate([
    common_1.Injectable(),
    common_1.Controller('user/performer-assets/galleries'),
    __metadata("design:paramtypes", [gallery_service_1.GalleryService,
        services_1.AuthService])
], UserGalleryController);
exports.UserGalleryController = UserGalleryController;
//# sourceMappingURL=user-gallery.controller.js.map