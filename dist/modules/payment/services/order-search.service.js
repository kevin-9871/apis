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
exports.OrderSearchService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const moment = require("moment");
const services_1 = require("../../performer/services");
const services_2 = require("../../user/services");
const providers_1 = require("../providers");
const dtos_1 = require("../dtos");
let OrderSearchService = class OrderSearchService {
    constructor(Order, performerService, userService) {
        this.Order = Order;
        this.performerService = performerService;
        this.userService = userService;
    }
    async search(req) {
        const query = {};
        if (req.deliveryStatus)
            query.deliveryStatus = req.deliveryStatus;
        if (req.sellerId)
            query.sellerId = req.sellerId;
        if (req.buyerId)
            query.buyerId = req.buyerId;
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
            this.Order
                .find(query)
                .lean()
                .sort(sort)
                .limit(parseInt(req.limit, 10))
                .skip(parseInt(req.offset, 10)),
            this.Order.countDocuments(query)
        ]);
        const dtos = data.map(d => new dtos_1.OrderDto(d));
        await this._mapSellerInfo(dtos);
        await this._mapBuyerInfo(dtos);
        return {
            total,
            data: dtos
        };
    }
    async _mapSellerInfo(orders) {
        const performerIds = orders.filter(o => o.sellerSource === 'performer')
            .map(o => o.sellerId);
        if (!performerIds.length)
            return;
        const performers = await this.performerService.findByIds(performerIds);
        orders.forEach(o => {
            if (o.sellerId) {
                const performer = performers.find(p => p._id.toString() === o.sellerId.toString());
                if (performer)
                    o.sellerInfo = performer.toResponse();
            }
        });
    }
    async _mapBuyerInfo(orders) {
        const userIds = orders.filter(o => o.buyerSource === 'user')
            .map(o => o.buyerId);
        if (!userIds.length)
            return;
        const users = await this.userService.findByIds(userIds);
        orders.forEach(o => {
            if (o.buyerId) {
                const buyer = users.find(p => p._id.toString() === o.buyerId.toString());
                if (buyer)
                    o.buyerInfo = buyer.toResponse();
            }
        });
    }
};
OrderSearchService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(providers_1.ORDER_MODEL_PROVIDER)),
    __param(1, common_1.Inject(common_1.forwardRef(() => services_1.PerformerService))),
    __param(2, common_1.Inject(common_1.forwardRef(() => services_2.UserService))),
    __metadata("design:paramtypes", [mongoose_1.Model,
        services_1.PerformerService,
        services_2.UserService])
], OrderSearchService);
exports.OrderSearchService = OrderSearchService;
//# sourceMappingURL=order-search.service.js.map