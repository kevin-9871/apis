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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotifyOrderUpdateListener = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const constants_1 = require("../constants");
const constants_2 = require("../../../kernel/constants");
const services_1 = require("../../mailer/services");
const services_2 = require("../../user/services");
const EMAIL_NOTIFY_ORDER_UPDATE = 'EMAIL_NOTIFY_ORDER_UPDATE';
let NotifyOrderUpdateListener = class NotifyOrderUpdateListener {
    constructor(queueEventService, mailService, userService) {
        this.queueEventService = queueEventService;
        this.mailService = mailService;
        this.userService = userService;
        this.logger = new common_1.Logger('UpdateOrderStatusListener');
        this.queueEventService.subscribe(constants_1.ORDER_UPDATE_CHANNEL, EMAIL_NOTIFY_ORDER_UPDATE, this.handler.bind(this));
    }
    async handler(event) {
        var _a;
        try {
            if (![constants_2.EVENT.UPDATED].includes(event.eventName)) {
                return;
            }
            const order = event.data.newValue;
            if (order.buyerSource !== 'user')
                return;
            const user = await this.userService.findById(order.buyerId);
            if (!user || !user.email)
                return;
            if (user.email) {
                await this.mailService.send({
                    subject: `Order ${order.orderNumber} has been updated`,
                    to: user.email,
                    data: {
                        user,
                        order,
                        oldDeliveryStatus: (_a = event.data.oldValue) === null || _a === void 0 ? void 0 : _a.deliveryStatus
                    },
                    template: 'update-order-status'
                });
            }
        }
        catch (error) {
            this.logger.error(error);
        }
    }
};
NotifyOrderUpdateListener = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [kernel_1.QueueEventService,
        services_1.MailerService,
        services_2.UserService])
], NotifyOrderUpdateListener);
exports.NotifyOrderUpdateListener = NotifyOrderUpdateListener;
//# sourceMappingURL=notify-order-update.listener.js.map