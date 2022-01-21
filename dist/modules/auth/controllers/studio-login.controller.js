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
exports.StudioLoginController = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const settings_1 = require("../../settings");
const services_1 = require("../../studio/services");
const constants_1 = require("../../studio/constants");
const exceptions_1 = require("../exceptions");
const payloads_1 = require("../payloads");
const services_2 = require("../services");
let StudioLoginController = class StudioLoginController {
    constructor(studoService, authService) {
        this.studoService = studoService;
        this.authService = authService;
    }
    async loginByEmail(req) {
        const studio = await this.studoService.findByEmail(req.email);
        if (!studio) {
            throw new exceptions_1.EmailOrPasswordIncorrectException();
        }
        const auth = await this.authService.findBySource({
            source: 'studio',
            type: 'email',
            key: req.email
        });
        if (!auth) {
            throw new exceptions_1.AccountNotFoundxception();
        }
        if (!this.authService.verifyPassword(req.password, auth)) {
            throw new exceptions_1.EmailOrPasswordIncorrectException();
        }
        if (settings_1.SettingService.getValueByKey('requireEmailVerification')
            && !studio.emailVerified) {
            throw new exceptions_1.EmailNotVerifiedException();
        }
        if (studio.status === constants_1.STUDIO_STATUES.PENDING) {
            throw new exceptions_1.EmailNotVerifiedException();
        }
        else if (studio.status === constants_1.STUDIO_STATUES.INACTIVE) {
            throw new exceptions_1.AccountInactiveException();
        }
        return kernel_1.DataResponse.ok({
            token: this.authService.generateJWT(auth, {
                expiresIn: req.remember ? 60 * 60 * 365 : 60 * 60 * 24
            })
        });
    }
};
__decorate([
    common_1.Post('login'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.LoginByEmailPayload]),
    __metadata("design:returntype", Promise)
], StudioLoginController.prototype, "loginByEmail", null);
StudioLoginController = __decorate([
    common_1.Controller('auth/studio'),
    __metadata("design:paramtypes", [services_1.StudioService,
        services_2.AuthService])
], StudioLoginController);
exports.StudioLoginController = StudioLoginController;
//# sourceMappingURL=studio-login.controller.js.map