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
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const constants_1 = require("../../../kernel/constants");
const mongoose_1 = require("mongoose");
const settings_1 = require("../../settings");
const constants_2 = require("../../settings/constants");
const exceptions_1 = require("../exceptions");
const constants_3 = require("../constants");
const providers_1 = require("../providers");
const ccbill_service_1 = require("./ccbill.service");
const SUPPORTED_GATEWAYS = ['ccbill'];
let PaymentService = class PaymentService {
    constructor(PaymentTransactionModel, ccbillService, settingService, queueEventService) {
        this.PaymentTransactionModel = PaymentTransactionModel;
        this.ccbillService = ccbillService;
        this.settingService = settingService;
        this.queueEventService = queueEventService;
    }
    async findById(id) {
        return this.PaymentTransactionModel.findById(id);
    }
    async _getCCBillSettings() {
        const [flexformId, subAccountNumber, salt, currencyCode] = await Promise.all([
            this.settingService.getKeyValue(constants_2.SETTING_KEYS.CCBILL_FLEXFORM_ID),
            this.settingService.getKeyValue(constants_2.SETTING_KEYS.CCBILL_SUB_ACCOUNT_NUMBER),
            this.settingService.getKeyValue(constants_2.SETTING_KEYS.CCBILL_SALT),
            this.settingService.getKeyValue(constants_2.SETTING_KEYS.CCBILL_CURRENCY_CODE)
        ]);
        if (!flexformId || !subAccountNumber || !salt) {
            throw new exceptions_1.MissingConfigPaymentException();
        }
        return {
            flexformId,
            subAccountNumber,
            salt,
            currencyCode
        };
    }
    async _createTransactionFromOrder(order, paymentGateway = 'ccbill') {
        const paymentTransaction = new this.PaymentTransactionModel();
        paymentTransaction.orderId = order._id;
        paymentTransaction.paymentGateway = paymentGateway;
        paymentTransaction.buyerSource = order.buyerSource;
        paymentTransaction.buyerId = order.buyerId;
        paymentTransaction.type = order.type;
        paymentTransaction.totalPrice = order.totalPrice;
        paymentTransaction.products = [{
                name: order.name,
                description: order.description,
                price: order.totalPrice,
                productType: order.productType,
                productId: order.productId,
                quantity: order.quantity,
                extraInfo: null
            }];
        paymentTransaction.paymentResponseInfo = null;
        paymentTransaction.status = constants_3.PAYMENT_STATUS.PENDING;
        return paymentTransaction.save();
    }
    async processSinglePayment(order, paymentGateway = 'ccbill') {
        if (!SUPPORTED_GATEWAYS.includes(paymentGateway))
            throw new common_1.BadRequestException(`Does not support payment gateway${paymentGateway}`);
        const ccbillConfig = await this._getCCBillSettings();
        const transaction = await this._createTransactionFromOrder(order, paymentGateway);
        return this.ccbillService.singlePurchase(Object.assign(ccbillConfig, {
            price: transaction.totalPrice,
            transactionId: transaction._id
        }));
    }
    async ccbillSinglePaymentSuccessWebhook(payload) {
        const transactionId = payload['X-transactionId'] || payload.transactionId;
        if (!transactionId) {
            throw new common_1.BadRequestException();
        }
        const checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$');
        if (!checkForHexRegExp.test(transactionId)) {
            return { ok: false };
        }
        const transaction = await this.PaymentTransactionModel.findById(transactionId);
        if (!transaction || transaction.status !== constants_3.PAYMENT_STATUS.PENDING) {
            return { ok: false };
        }
        transaction.status = constants_3.PAYMENT_STATUS.SUCCESS;
        transaction.paymentResponseInfo = payload;
        await transaction.save();
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: constants_3.TRANSACTION_SUCCESS_CHANNEL,
            eventName: constants_1.EVENT.CREATED,
            data: transaction
        }));
        return { ok: true };
    }
    async ccbillRenewalSuccessWebhook(payload) {
        const subscriptionId = payload.subscriptionId || payload.subscription_id;
        if (!subscriptionId) {
            throw new common_1.BadRequestException();
        }
        const transaction = await this.PaymentTransactionModel.findOne({
            'paymentResponseInfo.subscriptionId': subscriptionId
        });
        if (!transaction) {
            return { ok: false };
        }
        const newTransaction = new this.PaymentTransactionModel(transaction.toObject());
        newTransaction.paymentResponseInfo = payload;
        newTransaction.status = constants_3.PAYMENT_STATUS.SUCCESS;
        await newTransaction.save();
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: constants_3.TRANSACTION_SUCCESS_CHANNEL,
            eventName: constants_1.EVENT.CREATED,
            data: newTransaction
        }));
        return { ok: true };
    }
};
PaymentService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(providers_1.PAYMENT_TRANSACTION_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        ccbill_service_1.CCBillService,
        settings_1.SettingService,
        kernel_1.QueueEventService])
], PaymentService);
exports.PaymentService = PaymentService;
//# sourceMappingURL=payment.service.js.map