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
exports.PerformerRegisterController = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const settings_1 = require("../../settings");
const file_1 = require("../../file");
const services_1 = require("../../file/services");
const services_2 = require("../../performer/services");
const constants_1 = require("../../performer/constants");
const lodash_1 = require("lodash");
const constants_2 = require("../../../kernel/constants");
const payloads_1 = require("../payloads");
const services_3 = require("../services");
let PerformerRegisterController = class PerformerRegisterController {
    constructor(performerService, authService, verificationService, fileService) {
        this.performerService = performerService;
        this.authService = authService;
        this.verificationService = verificationService;
        this.fileService = fileService;
    }
    async performerRegister(payload, files) {
        try {
            if (!files.idVerification || !files.documentVerification) {
                throw new common_1.HttpException('Missing document!', 400);
            }
            const requireEmailVerification = settings_1.SettingService.getValueByKey('requireEmailVerification');
            const performer = await this.performerService.register(Object.assign(Object.assign({}, lodash_1.omit(payload, constants_2.EXCLUDE_FIELDS)), { avatarId: null, emailVerified: !requireEmailVerification, status: requireEmailVerification ? constants_1.PERFORMER_STATUSES.PENDING : constants_1.PERFORMER_STATUSES.ACTIVE, idVerificationId: files.idVerification._id, documentVerificationId: files.documentVerification._id }));
            await Promise.all([
                this.authService.create({
                    source: 'performer',
                    sourceId: performer._id,
                    type: 'email',
                    key: performer.email.toLowerCase().trim(),
                    value: payload.password
                }),
                this.authService.create({
                    source: 'performer',
                    sourceId: performer._id,
                    type: 'username',
                    key: performer.username.trim(),
                    value: payload.password
                })
            ]);
            requireEmailVerification
                && (await this.verificationService.sendVerificationEmail(performer._id, performer.email, 'performer'));
            return kernel_1.DataResponse.ok({
                message: requireEmailVerification ? 'We have sent an email to verify your email, please check your inbox.' : 'Your register has been successfully.'
            });
        }
        catch (e) {
            files.idVerification && await this.fileService.remove(files.idVerification._id);
            files.documentVerification && await this.fileService.remove(files.documentVerification._id);
            throw e;
        }
    }
};
__decorate([
    common_1.Post('register'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    common_1.UseInterceptors(file_1.MultiFileUploadInterceptor([
        {
            type: 'performer-document',
            fieldName: 'idVerification',
            options: {
                destination: kernel_1.getConfig('file').documentDir
            }
        },
        {
            type: 'performer-document',
            fieldName: 'documentVerification',
            options: {
                destination: kernel_1.getConfig('file').documentDir
            }
        }
    ], {})),
    __param(0, common_1.Body()),
    __param(1, file_1.FilesUploaded()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.PerformerRegisterPayload, Object]),
    __metadata("design:returntype", Promise)
], PerformerRegisterController.prototype, "performerRegister", null);
PerformerRegisterController = __decorate([
    common_1.Controller('auth/performers'),
    __metadata("design:paramtypes", [services_2.PerformerService,
        services_3.AuthService,
        services_3.VerificationService,
        services_1.FileService])
], PerformerRegisterController);
exports.PerformerRegisterController = PerformerRegisterController;
//# sourceMappingURL=performer-register.controller.js.map