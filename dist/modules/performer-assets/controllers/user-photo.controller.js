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
exports.UserPhotosController = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const services_1 = require("../../auth/services");
const decorators_1 = require("../../auth/decorators");
const interceptors_1 = require("../../auth/interceptors");
const dtos_1 = require("../../user/dtos");
const services_2 = require("../services");
const photo_search_service_1 = require("../services/photo-search.service");
let UserPhotosController = class UserPhotosController {
    constructor(photoSearchService, photoService, authService) {
        this.photoSearchService = photoSearchService;
        this.photoService = photoService;
        this.authService = authService;
    }
    async list(id, req, user, request) {
        const auth = request.authUser && { _id: request.authUser.authId, source: request.authUser.source, sourceId: request.authUser.sourceId };
        const jwToken = request.authUser && this.authService.generateJWT(auth, { expiresIn: 1 * 60 * 60 });
        const data = await this.photoSearchService.userSearch(id, req, user, jwToken);
        return kernel_1.DataResponse.ok(data);
    }
    async checkAuth(request, response) {
        if (!request.query.galleryId) {
            return response.status(common_1.HttpStatus.UNAUTHORIZED).send();
        }
        const valid = await this.photoService.checkAuth(request);
        return response.status(valid ? common_1.HttpStatus.OK : common_1.HttpStatus.UNAUTHORIZED).send();
    }
};
__decorate([
    common_1.Get('/:galleryId/search'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseInterceptors(interceptors_1.UserInterceptor),
    __param(0, common_1.Param('galleryId')),
    __param(1, common_1.Query()),
    __param(2, decorators_1.CurrentUser()),
    __param(3, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, kernel_1.SearchRequest,
        dtos_1.UserDto, Object]),
    __metadata("design:returntype", Promise)
], UserPhotosController.prototype, "list", null);
__decorate([
    common_1.Get('/auth/check'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Request()),
    __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserPhotosController.prototype, "checkAuth", null);
UserPhotosController = __decorate([
    common_1.Injectable(),
    common_1.Controller('user/performer-assets/photos'),
    __metadata("design:paramtypes", [photo_search_service_1.PhotoSearchService,
        services_2.PhotoService,
        services_1.AuthService])
], UserPhotosController);
exports.UserPhotosController = UserPhotosController;
//# sourceMappingURL=user-photo.controller.js.map