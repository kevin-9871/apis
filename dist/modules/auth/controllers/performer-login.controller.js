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
exports.PerformerLoginController = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const services_1 = require("../../performer/services");
const constants_1 = require("../../performer/constants");
const settings_1 = require("../../settings");
const exceptions_1 = require("../exceptions");
const payloads_1 = require("../payloads");
const services_2 = require("../services");
let PerformerLoginController = class PerformerLoginController {
    constructor(performerService, authService) {
        this.performerService = performerService;
        this.authService = authService;
    }
    async loginByUsername(req) {
        const auth = await this.authService.findBySource({
            source: 'performer',
            type: 'username',
            key: req.username
        });
        if (!auth) {
            throw new exceptions_1.AccountNotFoundxception();
        }
        if (!this.authService.verifyPassword(req.password, auth)) {
            throw new exceptions_1.UsernameOrPasswordIncorrectException();
        }
        const performer = await this.performerService.findById(auth.sourceId);
        if (!performer) {
            throw new kernel_1.EntityNotFoundException();
        }
        if ((settings_1.SettingService.getValueByKey('requireEmailVerification') && performer.status === constants_1.PERFORMER_STATUSES.PENDING)
            || (settings_1.SettingService.getValueByKey('requireEmailVerification') && !performer.emailVerified)) {
            throw new exceptions_1.EmailNotVerifiedException();
        }
        if (performer.status === constants_1.PERFORMER_STATUSES.PENDING) {
            throw new common_1.HttpException('Please verify your email', 400);
        }
        else if (performer.status === constants_1.PERFORMER_STATUSES.INACTIVE) {
            throw new exceptions_1.AccountInactiveException();
        }
        return kernel_1.DataResponse.ok({
            token: this.authService.generateJWT(auth, {
                expiresIn: req.remember ? 60 * 60 * 365 : 60 * 60 * 24
            })
        });
    }
    async loginByEmail(req) {
        const auth = await this.authService.findBySource({
            source: 'performer',
            type: 'email',
            key: req.email
        });
        if (!auth) {
            throw new exceptions_1.AccountNotFoundxception();
        }
        if (!this.authService.verifyPassword(req.password, auth)) {
            throw new exceptions_1.EmailOrPasswordIncorrectException();
        }
        const performer = await this.performerService.findById(auth.sourceId);
        if (!performer) {
            throw new kernel_1.EntityNotFoundException();
        }
        if ((settings_1.SettingService.getValueByKey('requireEmailVerification') && performer.status === constants_1.PERFORMER_STATUSES.PENDING)
            || (settings_1.SettingService.getValueByKey('requireEmailVerification') && !performer.emailVerified)) {
            throw new exceptions_1.EmailNotVerifiedException();
        }
        if (performer.status === constants_1.PERFORMER_STATUSES.PENDING) {
            throw new common_1.HttpException('Please verify your email', 400);
        }
        else if (performer.status === constants_1.PERFORMER_STATUSES.INACTIVE) {
            throw new common_1.HttpException('Your account is disabled. Please contact the admin for details!', 401);
        }
        return kernel_1.DataResponse.ok({
            token: this.authService.generateJWT(auth, {
                expiresIn: req.remember ? 60 * 60 * 365 : 60 * 60 * 24
            })
        });
    }
};
__decorate([
    common_1.Post('performers/login'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.LoginByUsernamePayload]),
    __metadata("design:returntype", Promise)
], PerformerLoginController.prototype, "loginByUsername", null);
__decorate([
    common_1.Post('performers/login/email'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.LoginByEmailPayload]),
    __metadata("design:returntype", Promise)
], PerformerLoginController.prototype, "loginByEmail", null);
PerformerLoginController = __decorate([
    common_1.Controller('auth'),
    __metadata("design:paramtypes", [services_1.PerformerService, services_2.AuthService])
], PerformerLoginController);
exports.PerformerLoginController = PerformerLoginController;
//# sourceMappingURL=performer-login.controller.js.map