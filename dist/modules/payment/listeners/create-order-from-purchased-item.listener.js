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
exports.CreateOrderFromPurchasedItemListener = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const constants_1 = require("../constants");
const constants_2 = require("../../../kernel/constants");
const services_1 = require("../../mailer/services");
const services_2 = require("../../user/services");
const mongoose_1 = require("mongoose");
const constants_3 = require("../../purchased-item/constants");
const models_1 = require("../../purchased-item/models");
const services_3 = require("../../performer-assets/services");
const services_4 = require("../../performer/services");
const dtos_1 = require("../../performer-assets/dtos");
const services_5 = require("../../file/services");
const providers_1 = require("../providers");
const constants_4 = require("../constants");
const CREATE_ORDER_FROM_PURCHASED_ITEM = 'CREATE_ORDER_FROM_PURCHASED_ITEM';
let CreateOrderFromPurchasedItemListener = class CreateOrderFromPurchasedItemListener {
    constructor(queueEventService, mailService, userService, performerService, productService, fileService, Order) {
        this.queueEventService = queueEventService;
        this.mailService = mailService;
        this.userService = userService;
        this.performerService = performerService;
        this.productService = productService;
        this.fileService = fileService;
        this.Order = Order;
        this.logger = new common_1.Logger('CreateOrderFromPurchasedItemListener');
        this.queueEventService.subscribe(constants_3.PURCHASED_ITEM_SUCCESS_CHANNEL, CREATE_ORDER_FROM_PURCHASED_ITEM, this.handler.bind(this));
    }
    async handler(event) {
        var _a, _b;
        try {
            if (![constants_2.EVENT.CREATED].includes(event.eventName)) {
                return;
            }
            const purchasedItem = event.data;
            if (purchasedItem.type !== constants_3.PURCHASE_ITEM_TYPE.PRODUCT)
                return;
            const product = await this.productService.findById(purchasedItem.targetId);
            if (!product)
                return;
            const orderNumber = `O${new Date().getTime()}`;
            const order = new this.Order({
                orderNumber,
                buyerId: purchasedItem.sourceId,
                buyerSource: purchasedItem.source,
                sellerId: purchasedItem.sellerId,
                sellerSource: 'performer',
                type: purchasedItem.type,
                productType: product.type,
                productId: product._id,
                name: product.name,
                description: purchasedItem.description,
                unitPrice: product.token,
                quantity: purchasedItem.quantity,
                originalPrice: product.token,
                totalPrice: purchasedItem.totalPrice,
                status: constants_1.ORDER_STATUS.PAID,
                deliveryStatus: product.type === constants_1.PRODUCT_TYPE.PHYSICAL_PRODUCT ? constants_1.DELIVERY_STATUS.CREATED : constants_1.DELIVERY_STATUS.DELIVERED,
                deliveryAddress: (_a = purchasedItem.extraInfo) === null || _a === void 0 ? void 0 : _a.deliveryAddress,
                portalCode: (_b = purchasedItem.extraInfo) === null || _b === void 0 ? void 0 : _b.portalCode,
                paymentStatus: constants_4.PAYMENT_STATUS.SUCCESS,
                payBy: 'token',
                couponInfo: null,
                shippingCode: null,
                extraInfo: null
            });
            await order.save();
            await this._emailNotification(order, product);
        }
        catch (error) {
            this.logger.error(error);
        }
    }
    async _emailNotification(order, product) {
        const [user, performer] = await Promise.all([
            this.userService.findById(order.buyerId),
            this.performerService.findById(order.sellerId)
        ]);
        if (user) {
            const template = product.type === constants_1.PRODUCT_TYPE.PHYSICAL_PRODUCT ?
                'user-payment-success' :
                'send-user-digital-product';
            const digitalLink = product.digitalFileId ? this.fileService.generateDownloadLink(product.digitalFileId) : '';
            await this.mailService.send({
                subject: 'New payment success',
                to: user.email,
                data: {
                    user,
                    order,
                    digitalLink
                },
                template
            });
        }
        if (performer) {
            await this.mailService.send({
                subject: 'New payment success',
                to: performer.email,
                data: {
                    user,
                    order
                },
                template: 'performer-payment-success'
            });
        }
    }
};
CreateOrderFromPurchasedItemListener = __decorate([
    common_1.Injectable(),
    __param(6, common_1.Inject(providers_1.ORDER_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [kernel_1.QueueEventService,
        services_1.MailerService,
        services_2.UserService,
        services_4.PerformerService,
        services_3.ProductService,
        services_5.FileService,
        mongoose_1.Model])
], CreateOrderFromPurchasedItemListener);
exports.CreateOrderFromPurchasedItemListener = CreateOrderFromPurchasedItemListener;
//# sourceMappingURL=create-order-from-purchased-item.listener.js.map