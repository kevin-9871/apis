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
exports.StudioRegisterController = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const settings_1 = require("../../settings");
const services_1 = require("../../studio/services");
const payloads_1 = require("../../studio/payloads");
const file_1 = require("../../file");
const constants_1 = require("../../settings/constants");
const lodash_1 = require("lodash");
const constants_2 = require("../../../kernel/constants");
const exceptions_1 = require("../exceptions");
const services_2 = require("../services");
let StudioRegisterController = class StudioRegisterController {
    constructor(studioService, authService, verificationService) {
        this.studioService = studioService;
        this.authService = authService;
        this.verificationService = verificationService;
    }
    async register(payload, file) {
        if (file.type !== 'document-verification') {
            throw new exceptions_1.DocumentMissiongException();
        }
        const requireEmailVerification = settings_1.SettingService.getValueByKey(constants_1.SETTING_KEYS.REQUIRE_EMAIL_VERIFICATION);
        const studio = await this.studioService.register(Object.assign(Object.assign({}, lodash_1.omit(payload, constants_2.EXCLUDE_FIELDS)), { documentVerificationId: file._id, emailVerified: !requireEmailVerification, status: requireEmailVerification ? constants_2.STATUS.PENDING : constants_2.STATUS.ACTIVE }));
        await Promise.all([
            this.authService.create({
                source: 'studio',
                sourceId: studio._id,
                type: 'email',
                key: studio.email,
                value: payload.password
            }),
            this.authService.create({
                source: 'studio',
                sourceId: studio._id,
                type: 'username',
                key: studio.username,
                value: payload.password
            })
        ]);
        requireEmailVerification &&
            (await this.verificationService.sendVerificationEmail(studio._id, studio.email, 'studio'));
        return kernel_1.DataResponse.ok({
            message: requireEmailVerification
                ? 'We have sent an email to verify your email, please check your inbox.'
                : 'Your register has been successfully.'
        });
    }
};
__decorate([
    common_1.Post('register'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseInterceptors(file_1.FileUploadInterceptor('document-verification', 'documentVerification', {
        destination: kernel_1.getConfig('file').documentDir
    })),
    __param(0, common_1.Body()),
    __param(1, file_1.FileUploaded()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.StudioCreatePayload,
        file_1.FileDto]),
    __metadata("design:returntype", Promise)
], StudioRegisterController.prototype, "register", null);
StudioRegisterController = __decorate([
    common_1.Controller('auth/studio'),
    __metadata("design:paramtypes", [services_1.StudioService,
        services_2.AuthService,
        services_2.VerificationService])
], StudioRegisterController);
exports.StudioRegisterController = StudioRegisterController;
//# sourceMappingURL=studio-register.controller.js.map