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
exports.PasswordController = void 0;
const common_1 = require("@nestjs/common");
const moment = require("moment");
const services_1 = require("../../user/services");
const services_2 = require("../../performer/services");
const services_3 = require("../../studio/services");
const dtos_1 = require("../../user/dtos");
const kernel_1 = require("../../../kernel");
const services_4 = require("../services");
const guards_1 = require("../guards");
const decorators_1 = require("../decorators");
const payloads_1 = require("../payloads");
const dtos_2 = require("../dtos");
const exceptions_1 = require("../exceptions");
let PasswordController = class PasswordController {
    constructor(userService, authService, performerService, studioService) {
        this.userService = userService;
        this.authService = authService;
        this.performerService = performerService;
        this.studioService = studioService;
    }
    async updatePassword(user, payload) {
        const auth = await this.authService.findBySource({
            source: payload.source || 'user',
            sourceId: user._id,
            type: payload.type || 'email'
        });
        if (!auth) {
            throw new exceptions_1.AccountNotFoundxception();
        }
        if (!this.authService.verifyPassword(payload.prePassword, auth)) {
            throw new exceptions_1.EmailOrPasswordIncorrectException();
        }
        await this.authService.update(new dtos_2.AuthUpdateDto({
            source: payload.source || 'user',
            sourceId: user._id,
            type: payload.type || 'email',
            value: payload.password
        }));
        return kernel_1.DataResponse.ok(true);
    }
    async updateUserPassword(payload, user) {
        await this.authService.update(new dtos_2.AuthUpdateDto({
            source: payload.source || 'user',
            sourceId: payload.userId || user._id,
            value: payload.password
        }));
        return kernel_1.DataResponse.ok(true);
    }
    async forgotPassword(req) {
        let user = null;
        if (req.type === 'user') {
            user = await this.userService.findByEmail(req.email);
        }
        if (req.type === 'performer') {
            user = await this.performerService.findByEmail(req.email);
        }
        if (req.type === 'studio') {
            user = await this.studioService.findByEmail(req.email);
        }
        if (!user) {
            throw new exceptions_1.AccountNotFoundxception();
        }
        let auth = null;
        if (req.type === 'user') {
            auth = await this.authService.findBySource({
                source: 'user',
                sourceId: user._id,
                type: 'email'
            });
        }
        if (req.type === 'performer') {
            auth = await this.authService.findBySource({
                source: 'performer',
                sourceId: user._id,
                type: 'email'
            });
        }
        if (req.type === 'studio') {
            auth = await this.authService.findBySource({
                source: 'studio',
                sourceId: user._id,
                type: 'email'
            });
        }
        if (!auth) {
            throw new exceptions_1.AccountNotFoundxception();
        }
        await this.authService.forgot(auth, {
            _id: user._id,
            email: user.email
        });
        return kernel_1.DataResponse.ok({
            success: true
        });
    }
    async renderUpdatePassword(res, token) {
        if (!token) {
            return res.render('404.html');
        }
        const forgot = await this.authService.getForgot(token);
        if (!forgot) {
            return res.render('404.html');
        }
        if (moment(forgot.createdAt).isAfter(moment().add(1, 'day'))) {
            await forgot.remove();
            return res.render('404.html');
        }
        return res.render('password-change.html');
    }
    async updatePasswordForm(res, token, password) {
        if (!token || !password || password.length < 6) {
            return res.render('404.html');
        }
        const forgot = await this.authService.getForgot(token);
        if (!forgot) {
            return res.render('404.html');
        }
        await this.authService.update(new dtos_2.AuthUpdateDto({
            source: forgot.source,
            sourceId: forgot.sourceId,
            value: password
        }));
        await forgot.remove();
        return res.render('password-change.html', {
            done: true
        });
    }
};
__decorate([
    common_1.Put('users/me/password'),
    common_1.UseGuards(guards_1.AuthGuard),
    __param(0, decorators_1.CurrentUser()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.UserDto,
        payloads_1.PasswordChangePayload]),
    __metadata("design:returntype", Promise)
], PasswordController.prototype, "updatePassword", null);
__decorate([
    common_1.Put('users/password'),
    decorators_1.Roles('admin'),
    common_1.UseGuards(guards_1.RoleGuard),
    __param(0, common_1.Body()),
    __param(1, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.PasswordUserChangePayload,
        dtos_1.UserDto]),
    __metadata("design:returntype", Promise)
], PasswordController.prototype, "updateUserPassword", null);
__decorate([
    common_1.Post('users/forgot'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.ForgotPayload]),
    __metadata("design:returntype", Promise)
], PasswordController.prototype, "forgotPassword", null);
__decorate([
    common_1.Get('password-change'),
    __param(0, common_1.Res()),
    __param(1, common_1.Query('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PasswordController.prototype, "renderUpdatePassword", null);
__decorate([
    common_1.Post('password-change'),
    __param(0, common_1.Res()),
    __param(1, common_1.Query('token')),
    __param(2, common_1.Body('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], PasswordController.prototype, "updatePasswordForm", null);
PasswordController = __decorate([
    common_1.Controller('auth'),
    __metadata("design:paramtypes", [services_1.UserService,
        services_4.AuthService,
        services_2.PerformerService,
        services_3.StudioService])
], PasswordController);
exports.PasswordController = PasswordController;
//# sourceMappingURL=password.controller.js.map