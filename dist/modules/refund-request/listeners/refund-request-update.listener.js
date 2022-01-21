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
exports.RefundRequestUpdateListener = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const services_1 = require("../../payment/services");
const constants_1 = require("../constants");
const REFUND_REQUEST_UPDATE_TOPIC = 'REFUND_REQUEST_UPDATE_TOPIC';
const REFUNDED = 'refunded';
let RefundRequestUpdateListener = class RefundRequestUpdateListener {
    constructor(queueEventService, orderService) {
        this.queueEventService = queueEventService;
        this.orderService = orderService;
        this.queueEventService.subscribe(constants_1.REFUND_REQUEST_CHANNEL, REFUND_REQUEST_UPDATE_TOPIC, this.handler.bind(this));
    }
    async handler(event) {
        try {
            if (event.eventName !== constants_1.REFUND_REQUEST_ACTION.UPDATED)
                return;
            const { oldStatus, request } = event.data;
            if (oldStatus !== request.status && request.status === constants_1.STATUES.RESOLVED) {
                const order = await this.orderService.findById(request.sourceId);
                if (!order)
                    return;
                order.deliveryStatus = REFUNDED;
                await Promise.all([]);
            }
        }
        catch (error) {
            console.log(error);
        }
    }
};
RefundRequestUpdateListener = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [kernel_1.QueueEventService,
        services_1.OrderService])
], RefundRequestUpdateListener);
exports.RefundRequestUpdateListener = RefundRequestUpdateListener;
//# sourceMappingURL=refund-request-update.listener.js.map