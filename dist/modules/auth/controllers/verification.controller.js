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
exports.VerifycationController = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const settings_1 = require("../../settings");
const constants_1 = require("../../settings/constants");
const exceptions_1 = require("../exceptions");
const payloads_1 = require("../payloads");
const services_1 = require("../services");
let VerifycationController = class VerifycationController {
    constructor(verificationService, authService, settingService) {
        this.verificationService = verificationService;
        this.authService = authService;
        this.settingService = settingService;
    }
    async resendVerificationEmail(payload) {
        const { email, source } = payload;
        const auth = await this.authService.findBySource({
            source,
            type: 'email',
            key: email
        });
        if (!auth) {
            throw new exceptions_1.AccountNotFoundxception();
        }
        await this.verificationService.sendVerificationEmail(auth.sourceId, email, source);
        return kernel_1.DataResponse.ok({ success: true });
    }
    async verifyEmail(res, token) {
        if (!token) {
            return res.render('404.html');
        }
        await this.verificationService.verifyEmail(token);
        const emailVerificationSuccessUrl = await this.settingService.getKeyValue(constants_1.SETTING_KEYS.EMAIL_VERIFICATION_SUCCESS_URL);
        return res.redirect(emailVerificationSuccessUrl || process.env.USER_URL);
    }
};
__decorate([
    common_1.Post('/resend-verification-email'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.ResendVerificationEmailPaload]),
    __metadata("design:returntype", Promise)
], VerifycationController.prototype, "resendVerificationEmail", null);
__decorate([
    common_1.Get('email-verification'),
    __param(0, common_1.Res()),
    __param(1, common_1.Query('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], VerifycationController.prototype, "verifyEmail", null);
VerifycationController = __decorate([
    common_1.Controller('verification'),
    __metadata("design:paramtypes", [services_1.VerificationService,
        services_1.AuthService,
        settings_1.SettingService])
], VerifycationController);
exports.VerifycationController = VerifycationController;
//# sourceMappingURL=verification.controller.js.map