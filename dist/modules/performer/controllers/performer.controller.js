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
exports.PerformerController = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const services_1 = require("../../auth/services");
const decorators_1 = require("../../auth/decorators");
const interceptors_1 = require("../../auth/interceptors");
const guards_1 = require("../../auth/guards");
const file_1 = require("../../file");
const dtos_1 = require("../../user/dtos");
const services_2 = require("../../favourite/services");
const settings_1 = require("../../settings");
const constants_1 = require("../../settings/constants");
const services_3 = require("../../utils/services");
const services_4 = require("../../file/services");
const lodash_1 = require("lodash");
const constants_2 = require("../../../kernel/constants");
const performer_broadcast_setting_payload_1 = require("../payloads/performer-broadcast-setting.payload");
const constants_3 = require("../constants");
const dtos_2 = require("../dtos");
const payloads_1 = require("../payloads");
const services_5 = require("../services");
let PerformerController = class PerformerController {
    constructor(authService, performerService, performerSearchService, favoriteService, settingService, countryService, fileService, queueEventService) {
        this.authService = authService;
        this.performerService = performerService;
        this.performerSearchService = performerSearchService;
        this.favoriteService = favoriteService;
        this.settingService = settingService;
        this.countryService = countryService;
        this.fileService = fileService;
        this.queueEventService = queueEventService;
    }
    async me(request) {
        const jwtToken = request.headers.authorization;
        const performer = await this.authService.getSourceFromJWT(jwtToken);
        if (!performer || performer.status !== constants_3.PERFORMER_STATUSES.ACTIVE) {
            throw new common_1.HttpException('Unauthorized', common_1.HttpStatus.UNAUTHORIZED);
        }
        const result = await this.performerService.getDetails(performer._id, jwtToken);
        return kernel_1.DataResponse.ok(new dtos_2.PerformerDto(result).toResponse(true));
    }
    async usearch(req, user, request) {
        const query = Object.assign({}, req);
        query.status = constants_3.PERFORMER_STATUSES.ACTIVE;
        let ipClient = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
        ipClient = Array.isArray(ipClient) ? ipClient.toString() : ipClient;
        if (ipClient.substr(0, 7) === '::ffff:') {
            ipClient = ipClient.substr(7);
        }
        const whiteListIps = ['127.0.0.1', '0.0.0.1'];
        let userCountry = null;
        let countryCode = null;
        if (whiteListIps.indexOf(ipClient) === -1) {
            userCountry = await this.countryService.findCountryByIP(ipClient);
            if (userCountry &&
                userCountry.status === 'success' &&
                userCountry.countryCode) {
                countryCode = userCountry.countryCode;
            }
        }
        const data = await this.performerSearchService.advancedSearch(query, user, countryCode);
        return kernel_1.DataResponse.ok({
            total: data.total,
            data: data.data
        });
    }
    async updatePerformer(currentPerformer, payload, request) {
        await this.performerService.update(currentPerformer._id, lodash_1.omit(payload, constants_2.EXCLUDE_FIELDS));
        const performer = await this.performerService.getDetails(currentPerformer._id, request.headers.authorization);
        return kernel_1.DataResponse.ok(new dtos_2.PerformerDto(performer).toResponse(true));
    }
    async getDetails(performerUsername, req, user) {
        let ipClient = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        ipClient = Array.isArray(ipClient) ? ipClient.toString() : ipClient;
        if (ipClient.substr(0, 7) === '::ffff:') {
            ipClient = ipClient.substr(7);
        }
        const whiteListIps = ['127.0.0.1', '0.0.0.1'];
        let userCountry = null;
        let countryCode = null;
        if (whiteListIps.indexOf(ipClient) === -1) {
            userCountry = await this.countryService.findCountryByIP(ipClient);
            if (userCountry &&
                userCountry.status === 'success' &&
                userCountry.countryCode) {
                countryCode = userCountry.countryCode;
            }
        }
        const performer = await this.performerService.findByUsername(performerUsername, countryCode, user);
        if (!performer || performer.status !== constants_3.PERFORMER_STATUSES.ACTIVE) {
            throw new kernel_1.EntityNotFoundException();
        }
        if (user) {
            const favorite = await this.favoriteService.findOne({
                favoriteId: performer._id,
                ownerId: user._id
            });
            if (favorite)
                performer.isFavorite = true;
        }
        const [defaultGroupChatPrice, defaultC2CPrice] = await Promise.all([
            this.settingService.get(constants_1.SETTING_KEYS.GROUP_CHAT_DEFAULT_PRICE),
            this.settingService.get(constants_1.SETTING_KEYS.PRIVATE_C2C_PRICE)
        ]);
        performer.privateCallPrice =
            performer.privateCallPrice || defaultC2CPrice.value;
        performer.groupCallPrice =
            performer.groupCallPrice || defaultGroupChatPrice.value;
        return kernel_1.DataResponse.ok(performer.toPublicDetailsResponse());
    }
    async uploadPerformerDocument(file, performer, request) {
        return kernel_1.DataResponse.ok(Object.assign(Object.assign({}, file), { url: `${file.getUrl()}?documentId=${file._id}&token=${request.headers.authorization}` }));
    }
    async uploadPerformerReleaseForm(file, performer, request) {
        return kernel_1.DataResponse.ok(Object.assign(Object.assign({}, file), { url: `${file.getUrl()}?documentId=${file._id}&token=${request.headers.authorization}` }));
    }
    async increaseView(performerId) {
        await this.performerService.viewProfile(performerId);
        return kernel_1.DataResponse.ok({
            success: true
        });
    }
    async uploadPerformerAvatar(file, performer) {
        await this.performerService.updateAvatar(performer._id, file);
        await this.fileService.addRef(file._id, {
            itemId: performer._id,
            itemType: 'performer-avatar'
        });
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: services_4.MEDIA_FILE_CHANNEL,
            eventName: services_4.FILE_EVENT.FILE_RELATED_MODULE_UPDATED,
            data: {
                type: services_4.DELETE_FILE_TYPE.FILEID,
                currentFile: performer.avatarId,
                newFile: file._id
            }
        }));
        return kernel_1.DataResponse.ok(Object.assign(Object.assign({}, file), { url: file.getUrl() }));
    }
    async updateBlockSetting(payload, performer) {
        const data = await this.performerService.updateBlockSetting(performer._id, payload);
        return kernel_1.DataResponse.ok(data);
    }
    async getBlockSetting(performer) {
        const data = await this.performerService.getBlockSetting(performer._id);
        return kernel_1.DataResponse.ok(new dtos_2.BlockSettingDto(data));
    }
    async checkBlock(performerId, req, user) {
        let ipClient = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        ipClient = Array.isArray(ipClient) ? ipClient.toString() : ipClient;
        if (ipClient.substr(0, 7) === '::ffff:') {
            ipClient = ipClient.substr(7);
        }
        const whiteListIps = ['127.0.0.1', '0.0.0.1'];
        let userCountry = null;
        let countryCode = null;
        if (whiteListIps.indexOf(ipClient) === -1) {
            userCountry = await this.countryService.findCountryByIP(ipClient);
            if (userCountry &&
                userCountry.status === 'success' &&
                userCountry.countryCode) {
                countryCode = userCountry.countryCode;
            }
        }
        const block = await this.performerService.checkBlock(performerId, countryCode, user);
        return kernel_1.DataResponse.ok(block);
    }
    async updateStreamingStatus(currentPerformer, payload) {
        await this.performerService.updateSteamingStatus(currentPerformer._id, payload.status);
        const performer = await this.performerService.findById(currentPerformer._id);
        return kernel_1.DataResponse.ok(new dtos_2.PerformerDto(performer).toResponse(true));
    }
    async updateDefaultPrice(currentPerformer, payload) {
        await this.performerService.updateDefaultPrice(currentPerformer._id, payload);
        const performer = await this.performerService.findById(currentPerformer._id);
        return kernel_1.DataResponse.ok(new dtos_2.PerformerDto(performer).toResponse(true));
    }
    async updateBroadcastSetting(currentPerformer, payload) {
        await this.performerService.updateBroadcastSetting(currentPerformer._id, payload);
        const performer = await this.performerService.findById(currentPerformer._id);
        return kernel_1.DataResponse.ok(new dtos_2.PerformerDto(performer).toResponse(true));
    }
    async suspendAccount(currentPerformer, id) {
        const resp = await this.performerService.selfSuspendAccount(id, currentPerformer);
        return kernel_1.DataResponse.ok(resp);
    }
    async checkAuth(request, response) {
        if (!request.query.token) {
            return response.status(common_1.HttpStatus.UNAUTHORIZED).send();
        }
        const user = await this.authService.getSourceFromJWT(request.query.token);
        if (!user) {
            return response.status(common_1.HttpStatus.UNAUTHORIZED).send();
        }
        const valid = await this.performerService.checkAuthDocument(request, user);
        return response
            .status(valid ? common_1.HttpStatus.OK : common_1.HttpStatus.UNAUTHORIZED)
            .send();
    }
    async getRandPerformer(size) {
        const resp = await this.performerSearchService.randomSelect(parseInt(size, 10) || 10);
        return kernel_1.DataResponse.ok(resp);
    }
};
__decorate([
    common_1.Get('/me'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PerformerController.prototype, "me", null);
__decorate([
    common_1.Get('/search'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseInterceptors(interceptors_1.UserInterceptor),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, common_1.Query()),
    __param(1, decorators_1.CurrentUser()),
    __param(2, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.PerformerSearchPayload,
        dtos_1.UserDto, Object]),
    __metadata("design:returntype", Promise)
], PerformerController.prototype, "usearch", null);
__decorate([
    common_1.Put('/'),
    decorators_1.Roles('performer'),
    common_1.UseGuards(guards_1.RoleGuard),
    __param(0, decorators_1.CurrentUser()),
    __param(1, common_1.Body()),
    __param(2, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_2.PerformerDto,
        payloads_1.PerformerUpdatePayload, Object]),
    __metadata("design:returntype", Promise)
], PerformerController.prototype, "updatePerformer", null);
__decorate([
    common_1.Get('/:username/view'),
    common_1.UseInterceptors(interceptors_1.UserInterceptor),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Param('username')),
    __param(1, common_1.Request()),
    __param(2, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], PerformerController.prototype, "getDetails", null);
__decorate([
    common_1.Post('/documents/upload'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('performer'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UseInterceptors(file_1.FileUploadInterceptor('performer-document', 'file', {
        destination: kernel_1.getConfig('file').documentDir
    })),
    __param(0, file_1.FileUploaded()),
    __param(1, decorators_1.CurrentUser()),
    __param(2, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [file_1.FileDto,
        dtos_2.PerformerDto, Object]),
    __metadata("design:returntype", Promise)
], PerformerController.prototype, "uploadPerformerDocument", null);
__decorate([
    common_1.Post('/release-form/upload'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('performer'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UseInterceptors(file_1.FileUploadInterceptor('performer-release-form', 'file', {
        destination: kernel_1.getConfig('file').documentDir
    })),
    __param(0, file_1.FileUploaded()),
    __param(1, decorators_1.CurrentUser()),
    __param(2, common_1.Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [file_1.FileDto,
        dtos_2.PerformerDto, Object]),
    __metadata("design:returntype", Promise)
], PerformerController.prototype, "uploadPerformerReleaseForm", null);
__decorate([
    common_1.Post('/:id/inc-view'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PerformerController.prototype, "increaseView", null);
__decorate([
    common_1.Post('/avatar/upload'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('performer'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UseInterceptors(file_1.FileUploadInterceptor('avatar', 'avatar', {
        destination: kernel_1.getConfig('file').avatarDir,
        generateThumbnail: true,
        replaceWithThumbail: true,
        thumbnailSize: kernel_1.getConfig('image').avatar
    })),
    __param(0, file_1.FileUploaded()),
    __param(1, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [file_1.FileDto,
        dtos_2.PerformerDto]),
    __metadata("design:returntype", Promise)
], PerformerController.prototype, "uploadPerformerAvatar", null);
__decorate([
    common_1.Post('/blocking/update'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('performer'),
    common_1.UseGuards(guards_1.RoleGuard),
    __param(0, common_1.Body()),
    __param(1, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.BlockSettingPayload,
        dtos_2.PerformerDto]),
    __metadata("design:returntype", Promise)
], PerformerController.prototype, "updateBlockSetting", null);
__decorate([
    common_1.Get('/blocking'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('performer'),
    common_1.UseGuards(guards_1.RoleGuard),
    __param(0, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_2.PerformerDto]),
    __metadata("design:returntype", Promise)
], PerformerController.prototype, "getBlockSetting", null);
__decorate([
    common_1.Get('/:performerId/check-blocking'),
    common_1.UseGuards(guards_1.AuthGuard),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Param('performerId')),
    __param(1, common_1.Request()),
    __param(2, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], PerformerController.prototype, "checkBlock", null);
__decorate([
    common_1.Post('/streaming-status/update'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('performer'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, decorators_1.CurrentUser()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_2.PerformerDto,
        payloads_1.PerformerStreamingStatusUpdatePayload]),
    __metadata("design:returntype", Promise)
], PerformerController.prototype, "updateStreamingStatus", null);
__decorate([
    common_1.Post('/default-price/update'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('performer'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, decorators_1.CurrentUser()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_2.PerformerDto,
        payloads_1.DefaultPricePayload]),
    __metadata("design:returntype", Promise)
], PerformerController.prototype, "updateDefaultPrice", null);
__decorate([
    common_1.Post('/broadcast-setting/update'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('performer'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, decorators_1.CurrentUser()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_2.PerformerDto,
        performer_broadcast_setting_payload_1.PerformerBroadcastSetting]),
    __metadata("design:returntype", Promise)
], PerformerController.prototype, "updateBroadcastSetting", null);
__decorate([
    common_1.Post('/suspend-account/:id'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    decorators_1.Roles('performer'),
    common_1.UseGuards(guards_1.RoleGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    __param(0, decorators_1.CurrentUser()),
    __param(1, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_2.PerformerDto, String]),
    __metadata("design:returntype", Promise)
], PerformerController.prototype, "suspendAccount", null);
__decorate([
    common_1.Get('/documents/auth/check'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Request()),
    __param(1, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PerformerController.prototype, "checkAuth", null);
__decorate([
    common_1.Get('/rand'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Query('size')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PerformerController.prototype, "getRandPerformer", null);
PerformerController = __decorate([
    common_1.Injectable(),
    common_1.Controller('performers'),
    __metadata("design:paramtypes", [services_1.AuthService,
        services_5.PerformerService,
        services_5.PerformerSearchService,
        services_2.FavouriteService,
        settings_1.SettingService,
        services_3.CountryService,
        services_4.FileService,
        kernel_1.QueueEventService])
], PerformerController);
exports.PerformerController = PerformerController;
//# sourceMappingURL=performer.controller.js.map