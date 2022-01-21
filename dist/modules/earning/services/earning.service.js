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
exports.EarningService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const dtos_1 = require("../../purchased-item/dtos");
const string_helper_1 = require("../../../kernel/helpers/string.helper");
const services_1 = require("../../studio/services");
const lodash_1 = require("lodash");
const moment = require("moment");
const constants_1 = require("../../../kernel/constants");
const earning_provider_1 = require("../providers/earning.provider");
const dtos_2 = require("../../user/dtos");
const services_2 = require("../../user/services");
const services_3 = require("../../performer/services");
const earning_dto_1 = require("../dtos/earning.dto");
const dtos_3 = require("../../performer/dtos");
const services_4 = require("../../purchased-item/services");
let EarningService = class EarningService {
    constructor(earningModel, userService, performerService, studioService, paymentService) {
        this.earningModel = earningModel;
        this.userService = userService;
        this.performerService = performerService;
        this.studioService = studioService;
        this.paymentService = paymentService;
    }
    async search(req, user) {
        const query = {};
        if (req.performerId) {
            query.performerId = string_helper_1.toObjectId(req.performerId);
        }
        if (req.targetId) {
            query.targetId = string_helper_1.toObjectId(req.targetId);
        }
        if (req.sourceId) {
            query.sourceId = string_helper_1.toObjectId(req.sourceId);
        }
        if (req.source) {
            query.source = req.source;
        }
        if (req.target) {
            query.target = req.target;
        }
        if (req.type) {
            query.type = req.type;
        }
        let sort = {
            createdAt: -1
        };
        if (req.sort && req.sortBy) {
            sort = {
                [req.sortBy]: req.sort
            };
        }
        if (req.fromDate && req.toDate) {
            query.createdAt = {
                $gt: moment(req.fromDate).startOf('day'),
                $lte: moment(req.toDate).endOf('day')
            };
        }
        const [data, total] = await Promise.all([
            this.earningModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(parseInt(req.limit, 10))
                .skip(parseInt(req.offset, 10)),
            this.earningModel.countDocuments(query)
        ]);
        const includePrivateInfo = user && user.roles && user.roles.includes('admin');
        const sources = data.map(d => ({
            id: d.sourceId,
            role: d.source
        }));
        const targets = data.map(d => ({
            id: d.targetId,
            role: d.target
        }));
        const users = [...sources, ...targets];
        const userInfos = await Promise.all(users.map(u => this.getInfo(u.id, u.role)));
        const earnings = data.map((earning) => {
            const { sourceId, targetId, conversionRate, netPrice } = earning;
            const sourceInfo = userInfos.find(s => s._id.toString() === sourceId.toString());
            const targetInfo = userInfos.find(t => t._id.toString() === targetId.toString());
            const price = conversionRate && conversionRate * netPrice;
            return Object.assign(Object.assign({}, earning), { sourceInfo, targetInfo, price });
        });
        return {
            total,
            data: earnings.map(e => new earning_dto_1.EarningDto(e).toResponse(includePrivateInfo))
        };
    }
    async getInfo(id, role) {
        if (role === constants_1.ROLE.PERFORMER) {
            return this.performerService.findById(id);
        }
        if (role === constants_1.ROLE.STUDIO) {
            return this.studioService.findById(id);
        }
        if (role === constants_1.ROLE.USER) {
            return this.userService.findById(id);
        }
        return null;
    }
    async details(id) {
        const earning = await this.earningModel.findById(string_helper_1.toObjectId(id));
        const transaction = await this.paymentService.findById(earning.transactionTokenId);
        if (!earning || !transaction) {
            throw new kernel_1.EntityNotFoundException();
        }
        const [user, performer] = await Promise.all([
            this.userService.findById(earning.userId),
            this.performerService.findById(earning.performerId)
        ]);
        const data = new earning_dto_1.EarningDto(earning);
        data.userInfo = user ? new dtos_2.UserDto(user).toResponse(true) : null;
        data.performerInfo = performer
            ? new dtos_3.PerformerDto(performer).toResponse(true)
            : null;
        data.transactionInfo = new dtos_1.PurchasedItemDto(transaction);
        return data;
    }
    async adminStats(req) {
        const query = {};
        if (req.performerId) {
            query.performerId = string_helper_1.toObjectId(req.performerId);
        }
        if (req.sourceId) {
            query.sourceType = string_helper_1.toObjectId(req.sourceId);
        }
        if (req.targetId) {
            query.targetId = string_helper_1.toObjectId(req.targetId);
        }
        if (req.source) {
            query.source = req.source;
        }
        if (req.target) {
            query.target = req.target;
        }
        if (req.type) {
            query.type = req.type;
        }
        if (req.fromDate && req.toDate) {
            query.createdAt = {
                $gt: moment(req.fromDate).startOf('day'),
                $lte: moment(req.toDate).endOf('day')
            };
        }
        const [totalPrice, paidPrice, remainingPrice] = await Promise.all([
            this.earningModel.aggregate([
                {
                    $match: query
                },
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: { $multiply: ['$grossPrice', '$conversionRate'] }
                        }
                    }
                }
            ]),
            this.earningModel.aggregate([
                {
                    $match: Object.assign(Object.assign({}, query), { isPaid: true })
                },
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: { $multiply: ['$netPrice', '$conversionRate'] }
                        }
                    }
                }
            ]),
            this.earningModel.aggregate([
                {
                    $match: Object.assign(Object.assign({}, query), { isPaid: false })
                },
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: { $multiply: ['$netPrice', '$conversionRate'] }
                        }
                    }
                }
            ])
        ]);
        return {
            totalPrice: (totalPrice.length && totalPrice[0].total) || 0,
            paidPrice: (paidPrice.length && paidPrice[0].total) || 0,
            remainingPrice: (remainingPrice.length && remainingPrice[0].total) || 0
        };
    }
    async stats(req) {
        const query = {};
        if (req.performerId) {
            query.performerId = string_helper_1.toObjectId(req.performerId);
        }
        if (req.sourceId) {
            query.sourceType = string_helper_1.toObjectId(req.sourceId);
        }
        if (req.targetId) {
            query.targetId = string_helper_1.toObjectId(req.targetId);
        }
        if (req.source) {
            query.source = req.source;
        }
        if (req.target) {
            query.target = req.target;
        }
        if (req.type) {
            query.type = req.type;
        }
        if (req.fromDate && req.toDate) {
            query.createdAt = {
                $gt: moment(req.fromDate).startOf('day'),
                $lte: moment(req.toDate).endOf('day')
            };
        }
        const [totalPrice, paidPrice, remainingPrice] = await Promise.all([
            this.earningModel.aggregate([
                {
                    $match: query
                },
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: '$grossPrice'
                        }
                    }
                }
            ]),
            this.earningModel.aggregate([
                {
                    $match: Object.assign(Object.assign({}, query), { isPaid: true })
                },
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: '$netPrice'
                        }
                    }
                }
            ]),
            this.earningModel.aggregate([
                {
                    $match: Object.assign(Object.assign({}, query), { isPaid: false })
                },
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: '$netPrice'
                        }
                    }
                }
            ])
        ]);
        return {
            totalPrice: (totalPrice.length && totalPrice[0].total) || 0,
            paidPrice: (paidPrice.length && paidPrice[0].total) || 0,
            remainingPrice: (remainingPrice.length && remainingPrice[0].total) || 0
        };
    }
    async calculatePayoutRequestStats(q) {
        const query = {};
        if (q.performerId) {
            query.performerId = string_helper_1.toObjectId(q.performerId);
        }
        if (q.targetId) {
            query.targetId = string_helper_1.toObjectId(q.targetId);
        }
        if (q.fromDate && q.toDate) {
            query.createdAt = {
                $gt: new Date(q.fromDate),
                $lte: new Date(q.toDate)
            };
        }
        const [totalPrice, paidPrice, remainingPrice] = await Promise.all([
            this.earningModel.aggregate([
                {
                    $match: Object.assign(Object.assign({}, query), { isPaid: false })
                },
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: '$netPrice'
                        }
                    }
                }
            ]),
            this.earningModel.aggregate([
                {
                    $match: Object.assign(Object.assign({}, query), { isPaid: true })
                },
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: '$netPrice'
                        }
                    }
                }
            ]),
            this.earningModel.aggregate([
                {
                    $match: Object.assign(Object.assign({}, lodash_1.pick(query, 'targetId')), { isPaid: false })
                },
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: '$netPrice'
                        }
                    }
                }
            ])
        ]);
        return {
            totalPrice: (totalPrice.length && totalPrice[0].total) || 0,
            paidPrice: (paidPrice.length && paidPrice[0].total) || 0,
            remainingPrice: (remainingPrice.length && remainingPrice[0].total) || 0
        };
    }
    async updatePaidStatus(payload) {
        const query = {
            targetId: payload.targetId,
            createdAt: {
                $gt: new Date(payload.fromDate),
                $lte: new Date(payload.toDate)
            }
        };
        return this.earningModel.updateMany(query, {
            $set: { isPaid: true, paidAt: new Date(), updatedAt: new Date() }
        });
    }
};
EarningService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(earning_provider_1.EARNING_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        services_2.UserService,
        services_3.PerformerService,
        services_1.StudioService,
        services_4.PurchaseItemService])
], EarningService);
exports.EarningService = EarningService;
//# sourceMappingURL=earning.service.js.map