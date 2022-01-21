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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const file_1 = require("../../file");
const kernel_1 = require("../../../kernel");
const constants_1 = require("../../../kernel/constants");
const services_1 = require("../../file/services");
const settings_1 = require("../../settings");
const constants_2 = require("../../settings/constants");
const providers_1 = require("../providers");
const dtos_1 = require("../dtos");
const constants_3 = require("../constants");
const exceptions_1 = require("../exceptions");
const username_existed_exception_1 = require("../exceptions/username-existed.exception");
let UserService = class UserService {
    constructor(userModel, shippingInfoModel, fileService, settingService) {
        this.userModel = userModel;
        this.shippingInfoModel = shippingInfoModel;
        this.fileService = fileService;
        this.settingService = settingService;
    }
    async find(params) {
        return this.userModel.find(params);
    }
    async findByEmail(email) {
        return this.userModel.findOne({ email: email.toLowerCase() });
    }
    async findByEmails(emails) {
        return this.userModel.find({ email: { $in: emails } });
    }
    async findById(id) {
        return this.userModel.findById(id);
    }
    async findByUsername(username) {
        const newUsername = username.toLowerCase();
        const user = await this.userModel.findOne({ username: newUsername });
        return user ? new dtos_1.UserDto(user) : null;
    }
    async findByIds(ids) {
        const users = await this.userModel.find({
            _id: { $in: ids }
        });
        return users.map(u => new dtos_1.UserDto(u));
    }
    async create(data, options = {}) {
        const count = await this.userModel.countDocuments({
            email: data.email.toLowerCase()
        });
        if (count) {
            throw new exceptions_1.EmailHasBeenTakenException();
        }
        const username = await this.findByUsername(data.username);
        if (username) {
            throw new username_existed_exception_1.UsernameExistedException();
        }
        const balance = await this.settingService.getKeyValue(constants_2.SETTING_KEYS.FREE_TOKENS) || 0;
        const user = Object.assign(Object.assign({}, data), { balance });
        user.createdAt = new Date();
        user.updatedAt = new Date();
        user.roles = options.roles || ['user'];
        user.status = options.status || constants_3.STATUS_ACTIVE;
        if (typeof options.emailVerified !== 'undefined') {
            user.emailVerified = options.emailVerified;
        }
        if (!user.name) {
            user.name = [user.firstName || '', user.lastName || ''].join(' ').trim();
        }
        return this.userModel.create(user);
    }
    async update(id, payload, user) {
        const data = Object.assign({}, payload);
        if (user && `${user._id}` === `${id}`) {
            delete data.email;
            delete data.username;
        }
        if (!user.name) {
            data.name = [user.firstName || '', user.lastName || ''].join(' ').trim();
        }
        return this.userModel.updateOne({ _id: id }, data, { new: true });
    }
    async updateAvatar(user, file) {
        await this.userModel.updateOne({ _id: user._id }, {
            avatarId: file._id,
            avatarPath: file.path
        });
        if (user.avatarId && user.avatarId !== file._id) {
            await this.fileService.remove(user.avatarId);
        }
        await this.fileService.addRef(file._id, {
            itemId: user._id,
            itemType: constants_1.ROLE.USER
        });
        return file;
    }
    async adminUpdate(id, payload) {
        const user = await this.userModel.findById(id);
        if (!user) {
            throw new kernel_1.EntityNotFoundException();
        }
        const data = Object.assign({}, payload);
        if (!user.name) {
            user.name = [user.firstName || '', user.lastName || ''].join(' ').trim();
        }
        if (data.email && data.email.toLowerCase() !== user.email.toLowerCase()) {
            const emailCheck = await this.userModel.countDocuments({
                email: data.email.toLowerCase(),
                _id: {
                    $ne: user._id
                }
            });
            if (emailCheck) {
                throw new exceptions_1.EmailHasBeenTakenException();
            }
        }
        if (data.username &&
            data.username.toLowerCase() !== user.username.toLowerCase()) {
            const usernameCheck = await this.userModel.countDocuments({
                username: user.username.toLowerCase(),
                _id: { $ne: user._id }
            });
            if (usernameCheck) {
                throw new username_existed_exception_1.UsernameExistedException();
            }
        }
        return this.userModel.updateOne({ _id: id }, data, { new: true });
    }
    async createShippingInfo(user, data) {
        const info = await this.shippingInfoModel.create(Object.assign(data, { userId: user._id }));
        return info;
    }
    async getShippingInfo(id) {
        const [total, data] = await Promise.all([
            this.shippingInfoModel.countDocuments({ userId: id }),
            this.shippingInfoModel.find({ userId: id })
        ]);
        return { data, total };
    }
    async updateVerificationStatus(userId) {
        return this.userModel.updateOne({
            _id: userId
        }, { status: constants_1.STATUS.ACTIVE, emailVerified: true }, { new: true });
    }
    async updateBalance(id, amount, withStats = true) {
        const stats = withStats
            ? {
                balance: amount,
                'stats.totalTokenEarned': amount > 0 ? amount : 0,
                'stats.totalTokenSpent': amount <= 0 ? amount : 0
            }
            : { balance: amount };
        return this.userModel.updateOne({ _id: id }, {
            $inc: stats
        });
    }
    async updateStats(id, payload) {
        return this.userModel.updateOne({ _id: id }, { $inc: payload });
    }
    async stats() {
        const [totalViewTime, totalTokenSpent] = await Promise.all([
            this.userModel.aggregate([
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: '$stats.totalViewTime'
                        }
                    }
                }
            ]),
            this.userModel.aggregate([
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: '$stats.totalTokenSpent'
                        }
                    }
                }
            ])
        ]);
        return {
            totalViewTime: (totalViewTime.length && totalViewTime[0].total) || 0,
            totalTokenSpent: (totalTokenSpent.length && totalTokenSpent[0].total) || 0
        };
    }
};
UserService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(providers_1.USER_MODEL_PROVIDER)),
    __param(1, common_1.Inject(providers_1.SHIPPING_INFO_PROVIDER)),
    __param(2, common_1.Inject(common_1.forwardRef(() => services_1.FileService))),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model,
        services_1.FileService,
        settings_1.SettingService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map