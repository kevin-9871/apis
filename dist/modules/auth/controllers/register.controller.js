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
exports.RegisterController = void 0;
const common_1 = require("@nestjs/common");
const services_1 = require("../../user/services");
const kernel_1 = require("../../../kernel");
const settings_1 = require("../../settings");
const constants_1 = require("../../user/constants");
const lodash_1 = require("lodash");
const constants_2 = require("../../../kernel/constants");
const dtos_1 = require("../dtos");
const payloads_1 = require("../payloads");
const services_2 = require("../services");
let RegisterController = class RegisterController {
    constructor(userService, authService, verificationService) {
        this.userService = userService;
        this.authService = authService;
        this.verificationService = verificationService;
    }
    async userRegister(req) {
        const requireEmailVerification = settings_1.SettingService.getValueByKey('requireEmailVerification');
        const user = await this.userService.create(lodash_1.omit(req, constants_2.EXCLUDE_FIELDS), {
            status: requireEmailVerification ? constants_1.STATUS.PENDING : constants_1.STATUS.ACTIVE,
            roles: constants_1.ROLE_USER,
            emailVerified: !requireEmailVerification
        });
        await Promise.all([
            this.authService.create(new dtos_1.AuthCreateDto({
                source: 'user',
                sourceId: user._id,
                type: 'email',
                value: req.password,
                key: req.email
            })),
            req.username
                && this.authService.create(new dtos_1.AuthCreateDto({
                    source: 'user',
                    sourceId: user._id,
                    type: 'username',
                    value: req.password,
                    key: req.username
                }))
        ]);
        requireEmailVerification && (await this.verificationService.sendVerificationEmail(user._id, user.email, 'user'));
        return kernel_1.DataResponse.ok({
            message: requireEmailVerification
                ? 'We have sent an email to verify your email, please check your inbox.'
                : 'Your register has been successfully.'
        });
    }
    async verifyEmail(res, token) {
        if (!token) {
            return res.render('404.html');
        }
        await this.verificationService.verifyEmail(token);
        return res.redirect(process.env.USER_URL);
    }
};
__decorate([
    common_1.Post('users/register'),
    common_1.HttpCode(common_1.HttpStatus.OK),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payloads_1.UserRegisterPayload]),
    __metadata("design:returntype", Promise)
], RegisterController.prototype, "userRegister", null);
__decorate([
    common_1.Get('email-verification'),
    __param(0, common_1.Res()), __param(1, common_1.Query('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], RegisterController.prototype, "verifyEmail", null);
RegisterController = __decorate([
    common_1.Controller('auth'),
    __metadata("design:paramtypes", [services_1.UserService,
        services_2.AuthService,
        services_2.VerificationService])
], RegisterController);
exports.RegisterController = RegisterController;
//# sourceMappingURL=register.controller.js.map