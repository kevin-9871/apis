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
exports.UserVideosController = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const interceptors_1 = require("../../auth/interceptors");
const services_1 = require("../../auth/services");
const decorators_1 = require("../../auth/decorators");
const dtos_1 = require("../../user/dtos");
const guards_1 = require("../../auth/guards");
const video_service_1 = require("../services/video.service");
const payloads_1 = require("../payloads");
const video_search_service_1 = require("../services/video-search.service");
let UserVideosController = class UserVideosController {
    constructor(videoService, videoSearchService, authService) {
        this.videoService = videoService;
        this.videoSearchService = videoSearchService;
        this.authService = authService;
    }
    async search(req, user, request) {
        const auth = request.authUser && { _id: request.authUser.authId, source: request.authUser.source, sourceId: request.authUser.sourceId };
        const jwToken = request.authUser && this.authService.generateJWT(auth, { expiresIn: 2 * 60 * 60 });
        const resp = await this.videoSearchService.userSearch(req, user, jwToken);
        return kernel_1.DataResponse.ok(resp);
    }
    async details(id, user, req) {
        const auth = req.authUser && { _id: req.authUser.authId, source: req.authUser.source, sourceId: req.authUser.sourceId };
        const jwToken = req.authUser && this.authService.generateJWT(auth, { expiresIn: 2 * 60 * 60 });
        const details = await this.videoService.userGetDetails(id, user, jwToken);
        return kernel_1.DataResponse.ok(details);
    }
    async view(id) {
        const details = await this.videoService.increaseView(id);
        return kernel_1.DataResponse.ok(details);
    }
    async checkAuth(request, response) {
        if (!request.query.videoId) {
            return response.status(common_1.HttpStatus.UNAUTHORIZED).send();
        }
        const valid = await this.videoService.checkAuth(request);
        return response.status(valid ? common_1.HttpStatus.OK : common_1.HttpStatus.UNAUTHORIZED).send();
    }
};
__decorate([
    common_1.Get('/search'),
    common_1.UseInterceptors(interceptors_1.UserInterceptor),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Query()),
    __param(1, decorators_1.CurrentUser()),
    __param(2, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.VideoSearchRequest,
        dtos_1.UserDto, Object]),
    __metadata("design:returntype", Promise)
], UserVideosController.prototype, "search", null);
__decorate([
    common_1.Get('/:id'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseInterceptors(interceptors_1.UserInterceptor),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Param('id')),
    __param(1, decorators_1.CurrentUser()),
    __param(2, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.UserDto, Object]),
    __metadata("design:returntype", Promise)
], UserVideosController.prototype, "details", null);
__decorate([
    common_1.Post('/:id/inc-view'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseGuards(guards_1.AuthGuard),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserVideosController.prototype, "view", null);
__decorate([
    common_1.Get('/auth/check'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Request()),
    __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserVideosController.prototype, "checkAuth", null);
UserVideosController = __decorate([
    common_1.Injectable(),
    common_1.Controller('user/performer-assets/videos'),
    __metadata("design:paramtypes", [video_service_1.VideoService,
        video_search_service_1.VideoSearchService,
        services_1.AuthService])
], UserVideosController);
exports.UserVideosController = UserVideosController;
//# sourceMappingURL=user-video.controller.js.map