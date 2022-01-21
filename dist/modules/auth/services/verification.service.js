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
exports.VerificationService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const mailer_1 = require("../../mailer");
const nestjs_config_1 = require("nestjs-config");
const services_1 = require("../../user/services");
const services_2 = require("../../performer/services");
const services_3 = require("../../studio/services");
const auth_provider_1 = require("../providers/auth.provider");
let VerificationService = class VerificationService {
    constructor(VerificationModel, mailService, config, userService, performerService, studioService) {
        this.VerificationModel = VerificationModel;
        this.mailService = mailService;
        this.config = config;
        this.userService = userService;
        this.performerService = performerService;
        this.studioService = studioService;
    }
    async sendVerificationEmail(sourceId, email, sourceType) {
        let verification = await this.VerificationModel.findOne({
            sourceId,
            value: email
        });
        if (!verification) {
            verification = new this.VerificationModel();
        }
        const token = kernel_1.StringHelper.randomString(15);
        verification.set('sourceId', sourceId);
        verification.set('sourceType', sourceType);
        verification.set('value', email);
        verification.set('token', token);
        await verification.save();
        const verificationLink = new URL(`auth/email-verification?token=${token}`, this.config.get('app.baseUrl')).href;
        await this.mailService.send({
            to: email,
            subject: 'Verify your email address',
            data: {
                verificationLink
            },
            template: 'email-verification'
        });
    }
    async verifyEmail(token) {
        const verification = await this.VerificationModel.findOne({
            token
        });
        if (!verification) {
            throw new kernel_1.EntityNotFoundException();
        }
        verification.verified = true;
        await verification.save();
        switch (verification.sourceType) {
            case 'user':
                await this.userService.updateVerificationStatus(verification.sourceId);
                break;
            case 'performer':
                await this.performerService.updateVerificationStatus(verification.sourceId);
                break;
            case 'studio':
                await this.studioService.updateVerificationStatus(verification.sourceId);
                break;
            default:
                break;
        }
    }
};
VerificationService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(auth_provider_1.VERIFICATION_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mailer_1.MailerService,
        nestjs_config_1.ConfigService,
        services_1.UserService,
        services_2.PerformerService,
        services_3.StudioService])
], VerificationService);
exports.VerificationService = VerificationService;
//# sourceMappingURL=verification.service.js.map