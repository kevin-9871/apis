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
exports.PaymentTokenService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const dtos_1 = require("../../user/dtos");
const providers_1 = require("../providers");
const constants_1 = require("../constants");
let PaymentTokenService = class PaymentTokenService {
    constructor(PaymentTokenModel) {
        this.PaymentTokenModel = PaymentTokenModel;
    }
    async checkBoughtVideo(id, user) {
        if (!user)
            return false;
        const transaction = await this.PaymentTokenModel.findOne({
            targetId: id,
            sourceId: user._id,
            type: constants_1.PURCHASE_ITEM_TYPE.SALE_VIDEO,
            status: constants_1.PURCHASE_ITEM_STATUS.SUCCESS
        });
        return !!transaction;
    }
    async checkBought(id, type, user) {
        if (!user)
            return false;
        const transaction = await this.PaymentTokenModel.findOne({
            type,
            targetId: id,
            sourceId: user._id,
            status: constants_1.PURCHASE_ITEM_STATUS.SUCCESS
        });
        return !!transaction;
    }
    async findByQuery(query) {
        const data = await this.PaymentTokenModel.find(query);
        return data;
    }
};
PaymentTokenService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(providers_1.PURCHASE_ITEM_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], PaymentTokenService);
exports.PaymentTokenService = PaymentTokenService;
//# sourceMappingURL=payment-token.service.js.map