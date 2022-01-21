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
exports.LoginController = void 0;
const common_1 = require("@nestjs/common");
const services_1 = require("../../user/services");
const kernel_1 = require("../../../kernel");
const settings_1 = require("../../settings");
const constants_1 = require("../../user/constants");
const payloads_1 = require("../payloads");
const services_2 = require("../services");
const exceptions_1 = require("../exceptions");
let LoginController = class LoginController {
    constructor(userService, authService) {
        this.userService = userService;
        this.authService = authService;
    }
    async loginByEmail(req) {
        const user = await this.userService.findByEmail(req.email);
        if (!user) {
            throw new exceptions_1.EmailOrPasswordIncorrectException();
        }
        if ((settings_1.SettingService.getValueByKey('requireEmailVerification') && user.status === constants_1.STATUS_PENDING)
            || (settings_1.SettingService.getValueByKey('requireEmailVerification') && !user.emailVerified)) {
            throw new exceptions_1.EmailNotVerifiedException();
        }
        if (user.status === constants_1.STATUS_INACTIVE) {
            throw new exceptions_1.AccountInactiveException();
        }
        const auth = await this.authService.findBySource({
            source: 'user',
            sourceId: user._id,
            type: 'email'
        });
        if (!auth) {
            throw new exceptions_1.AccountNotFoundxception();
        }
        if (!this.authService.verifyPassword(req.password, auth)) {
            throw new exceptions_1.EmailOrPasswordIncorrectException();
        }
        return kernel_1.DataResponse.ok({
            token: this.authService.generateJWT(auth, {
                expiresIn: req.remember ? 60 * 60 * 365 : 60 * 60 * 24
            })
        });
    }
    async loginByUsername(req) {
        const user = await this.userService.findByUsername(req.username);
        if (!user) {
            throw new exceptions_1.UsernameOrPasswordIncorrectException();
        }
        if ((settings_1.SettingService.getValueByKey('requireEmailVerification') && user.status === constants_1.STATUS_PENDING)
            || (settings_1.SettingService.getValueByKey('requireEmailVerification') && !user.emailVerified)) {
            throw new exceptions_1.EmailNotVerifiedException();
        }
        if (user.status === constants_1.STATUS_INACTIVE) {
            throw new exceptions_1.AccountInactiveException();
        }
        const auth = await this.authService.findBySource({
            source: 'user',
            sourceId: user._id,
            type: 'username'
        });
        if (!auth) {
            throw new exceptions_1.AccountNotFoundxception();
        }
        if (!this.authService.verifyPassword(req.password, auth)) {
            throw new exceptions_1.UsernameOrPasswordIncorrectException();
        }
        if (settings_1.SettingService.getValueByKey('requireEmailVerification') && user.status === constants_1.STATUS_PENDING) {
            throw new exceptions_1.EmailNotVerifiedException();
        }
        return kernel_1.DataResponse.ok({
            token: this.authService.generateJWT(auth, {
                expiresIn: req.remember ? 60 * 60 * 365 : 60 * 60 * 24
            })
        });
    }
};
__decorate([
    common_1.Post('users/login'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.LoginByEmailPayload]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "loginByEmail", null);
__decorate([
    common_1.Post('users/login/username'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.LoginByUsernamePayload]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "loginByUsername", null);
LoginController = __decorate([
    common_1.Controller('auth'),
    __metadata("design:paramtypes", [services_1.UserService, services_2.AuthService])
], LoginController);
exports.LoginController = LoginController;
//# sourceMappingURL=login.controller.js.map