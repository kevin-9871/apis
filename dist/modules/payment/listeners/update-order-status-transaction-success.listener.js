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
exports.UpdateOrderStatusPaymentTransactionSuccessListener = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const constants_1 = require("../constants");
const constants_2 = require("../../../kernel/constants");
const services_1 = require("../../mailer/services");
const settings_1 = require("../../settings");
const services_2 = require("../../user/services");
const mongoose_1 = require("mongoose");
const constants_3 = require("../constants");
const providers_1 = require("../providers");
const UPDATE_ORDER_STATUS_TRANSACTION_SUCCESS = 'UPDATE_ORDER_STATUS_TRANSACTION_SUCCESS';
let UpdateOrderStatusPaymentTransactionSuccessListener = class UpdateOrderStatusPaymentTransactionSuccessListener {
    constructor(queueEventService, mailService, userService, Order) {
        this.queueEventService = queueEventService;
        this.mailService = mailService;
        this.userService = userService;
        this.Order = Order;
        this.logger = new common_1.Logger('UpdateOrderStatusPaymentTransactionSuccessListener');
        this.queueEventService.subscribe(constants_1.TRANSACTION_SUCCESS_CHANNEL, UPDATE_ORDER_STATUS_TRANSACTION_SUCCESS, this.handler.bind(this));
    }
    async handler(event) {
        try {
            if (![constants_2.EVENT.CREATED].includes(event.eventName)) {
                return;
            }
            const transaction = event.data;
            const order = await this.Order.findById(transaction.orderId);
            if (!order)
                return;
            order.paymentStatus = constants_3.PAYMENT_STATUS.SUCCESS;
            order.status = constants_1.ORDER_STATUS.PAID;
            if (order.type === constants_1.PRODUCT_TYPE.TOKEN) {
                order.deliveryStatus = constants_1.DELIVERY_STATUS.DELIVERED;
            }
            await order.save();
            await this.queueEventService.publish(new kernel_1.QueueEvent({
                channel: constants_1.ORDER_PAID_SUCCESS_CHANNEL,
                eventName: constants_2.EVENT.CREATED,
                data: order
            }));
            if (order.buyerSource !== 'user')
                return;
            const user = await this.userService.findById(transaction.buyerId);
            if (!user)
                return;
            const adminEmail = settings_1.SettingService.getValueByKey('adminEmail') || process.env.ADMIN_EMAIL;
            if (adminEmail) {
                await this.mailService.send({
                    subject: 'New payment success',
                    to: adminEmail,
                    data: {
                        user,
                        order
                    },
                    template: 'admin-payment-success'
                });
            }
            if (user.email) {
                await this.mailService.send({
                    subject: 'New payment success',
                    to: user.email,
                    data: {
                        user,
                        order
                    },
                    template: 'user-payment-success'
                });
            }
        }
        catch (error) {
            this.logger.error(error);
        }
    }
};
UpdateOrderStatusPaymentTransactionSuccessListener = __decorate([
    common_1.Injectable(),
    __param(3, common_1.Inject(providers_1.ORDER_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [kernel_1.QueueEventService,
        services_1.MailerService,
        services_2.UserService,
        mongoose_1.Model])
], UpdateOrderStatusPaymentTransactionSuccessListener);
exports.UpdateOrderStatusPaymentTransactionSuccessListener = UpdateOrderStatusPaymentTransactionSuccessListener;
//# sourceMappingURL=update-order-status-transaction-success.listener.js.map