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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const mongoose_1 = require("mongoose");
const dtos_1 = require("../../user/dtos");
const dtos_2 = require("../../performer/dtos");
const services_1 = require("../../user/services");
const services_2 = require("../../performer/services");
const kernel_1 = require("../../../kernel");
const mailer_1 = require("../../mailer");
const nestjs_config_1 = require("nestjs-config");
const services_3 = require("../../studio/services");
const dtos_3 = require("../../studio/dtos");
const exceptions_1 = require("../exceptions");
const auth_provider_1 = require("../providers/auth.provider");
let AuthService = class AuthService {
    constructor(AuthModel, ForgotModel, userService, performerService, mailService, config, studioService) {
        this.AuthModel = AuthModel;
        this.ForgotModel = ForgotModel;
        this.userService = userService;
        this.performerService = performerService;
        this.mailService = mailService;
        this.config = config;
        this.studioService = studioService;
    }
    generateSalt(byteSize = 16) {
        return crypto.randomBytes(byteSize).toString('base64');
    }
    encryptPassword(pw, salt) {
        const defaultIterations = 10000;
        const defaultKeyLength = 64;
        return crypto
            .pbkdf2Sync(pw, salt, defaultIterations, defaultKeyLength, 'sha1')
            .toString('base64');
    }
    async create(data) {
        const salt = this.generateSalt();
        let newVal = data.value;
        if (['email', 'username'].includes(data.type) && newVal) {
            newVal = this.encryptPassword(newVal, salt);
        }
        let auth = await this.AuthModel.findOne({
            type: data.type,
            source: data.source,
            sourceId: data.sourceId
        });
        if (!auth) {
            auth = new this.AuthModel({
                type: data.type,
                source: data.source,
                sourceId: data.sourceId
            });
        }
        auth.salt = salt;
        auth.value = newVal;
        auth.key = data.key;
        return auth.save();
    }
    async changeNewKey(sourceId, type, newKey) {
        const auth = await this.AuthModel.findOne({
            type,
            sourceId
        });
        if (!auth)
            return null;
        auth.key = newKey;
        return auth.save();
    }
    async update(data) {
        const auths = await this.AuthModel.find({
            source: data.source,
            sourceId: data.sourceId
        });
        let user;
        switch (data.source) {
            case 'user':
                user = await this.userService.findById(data.sourceId);
                break;
            case 'studio':
                user = await this.studioService.findById(data.sourceId);
                break;
            case 'performer':
                user = await this.performerService.findById(data.sourceId);
                break;
            default:
                break;
        }
        if (!user) {
            throw new kernel_1.EntityNotFoundException();
        }
        const authEmail = auths.find(a => a.type === 'email');
        if (!authEmail && user.email) {
            await this.create({
                source: data.source,
                sourceId: data.sourceId,
                type: 'email',
                key: user.email,
                value: data.value
            });
        }
        const authUsername = auths.find(a => a.type === 'username');
        if (!authUsername && user.username) {
            await this.create({
                source: data.source,
                sourceId: data.sourceId,
                type: 'username',
                key: user.username,
                value: data.value
            });
        }
        await Promise.all(auths.map((auth) => {
            let newVal = data.value;
            const salt = this.generateSalt();
            newVal = this.encryptPassword(data.value, salt);
            auth.set('salt', salt);
            auth.set('value', newVal);
            return auth.save();
        }));
        return true;
    }
    async findBySource(options) {
        return this.AuthModel.findOne(options);
    }
    verifyPassword(pw, auth) {
        return this.encryptPassword(pw, auth.salt) === auth.value;
    }
    generateJWT(auth, options = {}) {
        const newOptions = Object.assign({ expiresIn: 60 * 60 * 24 }, options || {});
        return jwt.sign({
            authId: auth._id,
            source: auth.source,
            sourceId: auth.sourceId
        }, process.env.TOKEN_SECRET, {
            expiresIn: newOptions.expiresIn
        });
    }
    verifyJWT(token) {
        try {
            return jwt.verify(token, process.env.TOKEN_SECRET);
        }
        catch (e) {
            return false;
        }
    }
    decodeJWT(token) {
        try {
            const decoded = jwt.decode(token, { complete: true });
            return decoded['payload'];
        }
        catch (e) {
            return false;
        }
    }
    async getSourceFromJWT(jwt) {
        const decodded = this.verifyJWT(jwt);
        if (!decodded) {
            throw new exceptions_1.AuthErrorException();
        }
        if (decodded['source'] === 'user') {
            const user = await this.userService.findById(decodded['sourceId']);
            return new dtos_1.UserDto(user);
        }
        if (decodded['source'] === 'performer') {
            const user = await this.performerService.findById(decodded['sourceId']);
            if (user) {
                user.isPerformer = true;
            }
            return new dtos_2.PerformerDto(user);
        }
        if (decodded['source'] === 'studio') {
            const studio = await this.studioService.findById(decodded['sourceId']);
            return new dtos_3.StudioDto(studio);
        }
        return null;
    }
    async forgot(auth, source) {
        const token = kernel_1.StringHelper.randomString(14);
        await this.ForgotModel.create({
            token,
            source: auth.source,
            sourceId: source._id,
            authId: auth._id,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        const forgotLink = new URL(`auth/password-change?token=${token}`, this.config.get('app.baseUrl')).href;
        await this.mailService.send({
            subject: 'Recover password',
            to: source.email,
            data: {
                forgotLink
            },
            template: 'forgot'
        });
        return true;
    }
    async getForgot(token) {
        return this.ForgotModel.findOne({ token });
    }
};
AuthService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(auth_provider_1.AUTH_MODEL_PROVIDER)),
    __param(1, common_1.Inject(auth_provider_1.FORGOT_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model,
        services_1.UserService,
        services_2.PerformerService,
        mailer_1.MailerService,
        nestjs_config_1.ConfigService,
        services_3.StudioService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map