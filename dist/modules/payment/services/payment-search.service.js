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
exports.PaymentSearchService = void 0;
const common_1 = require("@nestjs/common");
const services_1 = require("../../user/services");
const dtos_1 = require("../../user/dtos");
const mongoose_1 = require("mongoose");
const moment = require("moment");
const providers_1 = require("../providers");
const dtos_2 = require("../dtos");
const constants_1 = require("../constants");
let PaymentSearchService = class PaymentSearchService {
    constructor(paymentTransactionModel, userService) {
        this.paymentTransactionModel = paymentTransactionModel;
        this.userService = userService;
    }
    async getUserTransactions(req, user) {
        const query = {
            buyerSource: 'user',
            buyerId: user._id,
            status: {
                $ne: constants_1.PAYMENT_STATUS.PENDING
            }
        };
        if (req.type)
            query.type = req.type;
        if (req.status)
            query.status = req.status;
        if (req.fromDate && req.toDate) {
            query.createdAt = {
                $gt: moment(req.fromDate).startOf('day'),
                $lt: moment(req.toDate).endOf('day')
            };
        }
        const sort = {
            [req.sortBy || 'updatedAt']: req.sort || -1
        };
        const [data, total] = await Promise.all([
            this.paymentTransactionModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(parseInt(req.limit, 10))
                .skip(parseInt(req.offset, 10)),
            this.paymentTransactionModel.countDocuments(query)
        ]);
        const paymentData = data.map(d => new dtos_2.PaymentDto(d));
        return {
            total,
            data: paymentData
        };
    }
    async adminGetUserTransactions(req) {
        const query = {
            status: {
                $ne: constants_1.PAYMENT_STATUS.PENDING
            }
        };
        if (req.type)
            query.type = req.type;
        if (req.status)
            query.status = req.status;
        if (req.fromDate && req.toDate) {
            query.createdAt = {
                $gt: moment(req.fromDate).startOf('day'),
                $lt: moment(req.toDate).endOf('day')
            };
        }
        if (req.sourceId)
            query.buyerId = req.sourceId;
        const sort = {
            [req.sortBy || 'updatedAt']: req.sort || -1
        };
        const [data, total] = await Promise.all([
            this.paymentTransactionModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(parseInt(req.limit, 10))
                .skip(parseInt(req.offset, 10)),
            this.paymentTransactionModel.countDocuments(query)
        ]);
        const paymentData = data.map(d => new dtos_2.PaymentDto(d));
        const userIds = paymentData
            .filter(p => p.buyerSource === 'user')
            .map(p => p.buyerId);
        if (userIds.length) {
            const users = await this.userService.findByIds(userIds);
            paymentData.forEach(p => {
                const buyer = users.find(u => u._id.toString() === p.buyerId.toString());
                if (buyer) {
                    p.buyerInfo = new dtos_1.UserDto(buyer).toResponse();
                }
            });
        }
        return {
            total,
            data: paymentData
        };
    }
};
PaymentSearchService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(providers_1.PAYMENT_TRANSACTION_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        services_1.UserService])
], PaymentSearchService);
exports.PaymentSearchService = PaymentSearchService;
//# sourceMappingURL=payment-search.service.js.map