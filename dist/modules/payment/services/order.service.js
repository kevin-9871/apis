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
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const dtos_1 = require("../../user/dtos");
const kernel_1 = require("../../../kernel");
const mongoose_1 = require("mongoose");
const services_1 = require("../../token-package/services");
const services_2 = require("../../performer/services");
const services_3 = require("../../user/services");
const constants_1 = require("../../../kernel/constants");
const providers_1 = require("../providers");
const constants_2 = require("../constants");
const dtos_2 = require("../dtos");
let OrderService = class OrderService {
    constructor(Order, tokenService, performerService, userService, queueEventService) {
        this.Order = Order;
        this.tokenService = tokenService;
        this.performerService = performerService;
        this.userService = userService;
        this.queueEventService = queueEventService;
    }
    async createTokenOrderFromPayload(packageId, user, orderStatus = constants_2.ORDER_STATUS.CREATED) {
        const packageToken = await this.tokenService.findById(packageId);
        if (!packageToken)
            throw new kernel_1.EntityNotFoundException();
        const orderNumber = `TP${new Date().getTime()}`;
        const order = new this.Order({
            orderNumber,
            buyerId: user._id,
            buyerSource: 'user',
            sellerId: null,
            sellerSource: 'system',
            type: constants_2.PRODUCT_TYPE.TOKEN,
            productType: constants_2.PRODUCT_TYPE.TOKEN,
            productId: packageToken._id,
            name: packageToken.name,
            description: `${packageToken.price.toFixed(2)} for ${packageToken.tokens} tokens`,
            unitPrice: packageToken.price,
            quantity: 1,
            originalPrice: packageToken.price,
            totalPrice: packageToken.price,
            status: orderStatus,
            deliveryStatus: constants_2.DELIVERY_STATUS.CREATED,
            deliveryAddress: '',
            paymentStatus: constants_2.PAYMENT_STATUS.PENDING,
            payBy: 'money',
            couponInfo: null,
            shippingCode: null,
            extraInfo: null
        });
        return order.save();
    }
    async findById(id) {
        const item = await this.Order.findById(id);
        return item ? new dtos_2.OrderDto(item.toObject()) : null;
    }
    async findByIds(ids) {
        const items = await this.Order.find({ _id: { $in: ids } });
        return items.map(i => new dtos_2.OrderDto(i));
    }
    async getDetails(id) {
        const order = id instanceof dtos_2.OrderDto ? id : await this.findById(id);
        if (!order)
            throw new kernel_1.EntityNotFoundException();
        if (order.sellerSource === 'performer') {
            const performer = await this.performerService.findById(order.sellerId);
            order.sellerInfo = performer === null || performer === void 0 ? void 0 : performer.toResponse();
        }
        const user = await this.userService.findById(order.buyerId);
        order.buyerInfo = {
            _id: user._id,
            username: user.username
        };
        return order;
    }
    async update(id, payload) {
        const order = await this.Order.findById(id);
        const oldDeliveryStatus = order.deliveryStatus;
        if (payload.deliveryStatus)
            order.deliveryStatus = payload.deliveryStatus;
        if (payload.shippingCode)
            order.shippingCode = payload.shippingCode;
        await order.save();
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: constants_2.ORDER_UPDATE_CHANNEL,
            eventName: constants_1.EVENT.UPDATED,
            data: {
                oldValue: {
                    deliveryStatus: oldDeliveryStatus
                },
                newValue: new dtos_2.OrderDto(order)
            }
        }));
        return order;
    }
};
OrderService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(providers_1.ORDER_MODEL_PROVIDER)),
    __param(1, common_1.Inject(common_1.forwardRef(() => services_1.TokenPackageService))),
    __param(2, common_1.Inject(common_1.forwardRef(() => services_2.PerformerService))),
    __param(3, common_1.Inject(common_1.forwardRef(() => services_3.UserService))),
    __metadata("design:paramtypes", [mongoose_1.Model,
        services_1.TokenPackageService,
        services_2.PerformerService,
        services_3.UserService,
        kernel_1.QueueEventService])
], OrderService);
exports.OrderService = OrderService;
//# sourceMappingURL=order.service.js.map