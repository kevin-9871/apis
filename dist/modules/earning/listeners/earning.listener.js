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
exports.TransactionEarningListener = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const constants_1 = require("../../purchased-item/constants");
const constants_2 = require("../../../kernel/constants");
const services_1 = require("../../performer/services");
const settings_1 = require("../../settings");
const dtos_1 = require("../../purchased-item/dtos");
const constants_3 = require("../../payment/constants");
const constants_4 = require("../../settings/constants");
const earning_provider_1 = require("../providers/earning.provider");
const UPDATE_EARNING_CHANNEL = 'EARNING_CHANNEL';
let TransactionEarningListener = class TransactionEarningListener {
    constructor(earningModel, queueEventService, performerService, settingService, performerCommission) {
        this.earningModel = earningModel;
        this.queueEventService = queueEventService;
        this.performerService = performerService;
        this.settingService = settingService;
        this.performerCommission = performerCommission;
        this.queueEventService.subscribe(constants_1.PURCHASED_ITEM_SUCCESS_CHANNEL, UPDATE_EARNING_CHANNEL, this.handleListenEarning.bind(this));
    }
    async handleListenEarning(event) {
        try {
            const transaction = event.data;
            if (event.eventName !== constants_2.EVENT.CREATED || (transaction === null || transaction === void 0 ? void 0 : transaction.status) !== constants_3.PAYMENT_STATUS.SUCCESS) {
                return;
            }
            const performerId = transaction.sellerId;
            const performer = await this.performerService.findById(performerId);
            if (!performer) {
                return;
            }
            let commission = 0;
            let studioCommision = 0;
            const [setting, defaultStudioCommission, performerCommission, conversionRate] = await Promise.all([
                this.settingService.get(constants_4.SETTING_KEYS.PERFORMER_COMMISSION),
                this.settingService.getKeyValue(constants_4.SETTING_KEYS.STUDIO_COMMISSION),
                this.performerCommission.findOne({ performerId: performer._id }),
                this.settingService.getKeyValue(constants_4.SETTING_KEYS.CONVERSION_RATE)
            ]);
            if (performer.studioId) {
                studioCommision = performerCommission
                    && typeof performerCommission.studioCommission === 'number'
                    ? performerCommission.studioCommission
                    : defaultStudioCommission;
                commission = performerCommission
                    && typeof performerCommission.memberCommission === 'number'
                    ? performerCommission.memberCommission
                    : parseInt(process.env.COMMISSION_RATE, 10);
                const newStudioEarning = {
                    conversionRate: conversionRate || parseInt(process.env.CONVERSION_RATE, 10),
                    grossPrice: transaction.totalPrice,
                    commission: studioCommision,
                    netPrice: transaction.totalPrice * (studioCommision / 100),
                    performerId: transaction.sellerId,
                    userId: transaction.sourceId,
                    transactionTokenId: transaction._id,
                    type: transaction.type,
                    createdAt: transaction.createdAt,
                    transactionStatus: transaction.status,
                    sourceId: transaction.sellerId,
                    source: constants_2.ROLE.PERFORMER,
                    target: constants_2.ROLE.STUDIO,
                    targetId: performer.studioId
                };
                await this.earningModel.create(newStudioEarning);
            }
            else if (performerCommission) {
                switch (transaction.type) {
                    case constants_1.PURCHASE_ITEM_TYPE.GROUP:
                        commission = performerCommission.groupCallCommission;
                        break;
                    case constants_1.PURCHASE_ITEM_TYPE.PRIVATE:
                        commission = performerCommission.privateCallCommission;
                        break;
                    case constants_1.PURCHASE_ITEM_TYPE.TIP:
                        commission = performerCommission.tipCommission;
                        break;
                    case constants_1.PURCHASE_ITEM_TYPE.PRODUCT:
                        commission = performerCommission.productCommission;
                        break;
                    case constants_1.PURCHASE_ITEM_TYPE.PHOTO:
                        commission = performerCommission.albumCommission;
                        break;
                    case constants_1.PURCHASE_ITEM_TYPE.SALE_VIDEO:
                        commission = performerCommission.videoCommission;
                        break;
                    default:
                        break;
                }
            }
            else {
                commission = setting.getValue();
            }
            const grossPrice = performer.studioId
                ? transaction.totalPrice * (studioCommision / 100)
                : transaction.totalPrice;
            const netPrice = grossPrice * (commission / 100);
            const newEarning = new this.earningModel();
            newEarning.set('conversionRate', conversionRate || parseInt(process.env.CONVERSION_RATE, 10));
            newEarning.set('grossPrice', grossPrice);
            newEarning.set('commission', commission);
            newEarning.set('netPrice', netPrice);
            newEarning.set('performerId', transaction.sellerId);
            newEarning.set('userId', transaction.sourceId);
            newEarning.set('transactionTokenId', transaction._id);
            newEarning.set('type', transaction.type);
            newEarning.set('createdAt', transaction.createdAt);
            newEarning.set('transactionStatus', transaction.status);
            newEarning.set('sourceId', transaction.sourceId);
            newEarning.set('targetId', transaction.sellerId);
            newEarning.set('source', constants_2.ROLE.USER);
            newEarning.set('target', constants_2.ROLE.PERFORMER);
            await newEarning.save();
        }
        catch (e) {
            console.log(e);
        }
    }
};
TransactionEarningListener = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(earning_provider_1.EARNING_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        kernel_1.QueueEventService,
        services_1.PerformerService,
        settings_1.SettingService,
        services_1.PerformerCommissionService])
], TransactionEarningListener);
exports.TransactionEarningListener = TransactionEarningListener;
//# sourceMappingURL=earning.listener.js.map