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
exports.UpdateUserBalanceFromOrderSuccessListener = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const constants_1 = require("../constants");
const constants_2 = require("../../../kernel/constants");
const services_1 = require("../../user/services");
const services_2 = require("../../token-package/services");
const UPDATE_USER_BALANCE_FROM_ORDER_PAID = 'UPDATE_USER_BALANCE_FROM_ORDER_PAID';
let UpdateUserBalanceFromOrderSuccessListener = class UpdateUserBalanceFromOrderSuccessListener {
    constructor(queueEventService, userService, tokenService) {
        this.queueEventService = queueEventService;
        this.userService = userService;
        this.tokenService = tokenService;
        this.logger = new common_1.Logger('UpdateUserBalanceFromOrderSuccessListener');
        this.queueEventService.subscribe(constants_1.ORDER_PAID_SUCCESS_CHANNEL, UPDATE_USER_BALANCE_FROM_ORDER_PAID, this.handler.bind(this));
    }
    async handler(event) {
        try {
            if (![constants_2.EVENT.CREATED].includes(event.eventName)) {
                return;
            }
            const order = event.data;
            if (order.productType !== constants_1.PRODUCT_TYPE.TOKEN && order.type !== constants_1.PRODUCT_TYPE.TOKEN || order.status !== constants_1.ORDER_STATUS.PAID)
                return;
            const tokenPackage = await this.tokenService.findById(order.productId);
            const amount = (tokenPackage === null || tokenPackage === void 0 ? void 0 : tokenPackage.tokens) || parseInt(`${order.totalPrice}`, 10);
            await this.userService.updateBalance(order.buyerId, amount, false);
        }
        catch (error) {
            this.logger.error(error);
        }
    }
};
UpdateUserBalanceFromOrderSuccessListener = __decorate([
    common_1.Injectable(),
    __param(2, common_1.Inject(common_1.forwardRef(() => services_2.TokenPackageService))),
    __metadata("design:paramtypes", [kernel_1.QueueEventService,
        services_1.UserService,
        services_2.TokenPackageService])
], UpdateUserBalanceFromOrderSuccessListener);
exports.UpdateUserBalanceFromOrderSuccessListener = UpdateUserBalanceFromOrderSuccessListener;
//# sourceMappingURL=update-user-balance-from-order-success.listener.js.map