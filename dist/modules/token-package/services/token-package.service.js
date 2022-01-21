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
exports.TokenPackageService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const lodash_1 = require("lodash");
const providers_1 = require("../providers");
const dtos_1 = require("../dtos");
let TokenPackageService = class TokenPackageService {
    constructor(tokenPackageModel) {
        this.tokenPackageModel = tokenPackageModel;
    }
    async find(params) {
        return this.tokenPackageModel.find(params);
    }
    async findById(id) {
        const query = { _id: id };
        return this.tokenPackageModel.findOne(query);
    }
    async create(payload) {
        const data = Object.assign({}, payload);
        const tokenPackage = await this.tokenPackageModel.create(data);
        return tokenPackage;
    }
    async update(id, payload) {
        const tokenPackage = await this.findById(id);
        if (!tokenPackage) {
            throw new common_1.NotFoundException();
        }
        lodash_1.merge(tokenPackage, payload);
        tokenPackage.set('updatedAt', new Date());
        await tokenPackage.save();
        return tokenPackage;
    }
    async delete(id) {
        const tokenPackage = await this.findById(id);
        if (!tokenPackage) {
            throw new common_1.NotFoundException();
        }
        await tokenPackage.remove();
        return true;
    }
    async getPublic(id) {
        const tokenPackage = await this.tokenPackageModel.findById(id);
        if (!tokenPackage) {
            throw new kernel_1.EntityNotFoundException();
        }
        const dto = new dtos_1.TokenPackageDto(tokenPackage);
        return dto;
    }
};
TokenPackageService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(providers_1.TOKEN_PACKAGE_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], TokenPackageService);
exports.TokenPackageService = TokenPackageService;
//# sourceMappingURL=token-package.service.js.map