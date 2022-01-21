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
exports.PurchaseItemService = void 0;
const common_1 = require("@nestjs/common");
const dtos_1 = require("../../user/dtos");
const kernel_1 = require("../../../kernel");
const constants_1 = require("../../../kernel/constants");
const mongoose_1 = require("mongoose");
const mongodb_1 = require("mongodb");
const services_1 = require("../../performer-assets/services");
const settings_1 = require("../../settings");
const constants_2 = require("../../settings/constants");
const services_2 = require("../../performer/services");
const constants_3 = require("../../performer-assets/constants");
const models_1 = require("../../performer-assets/models");
const models_2 = require("../models");
const providers_1 = require("../../performer-assets/providers");
const services_3 = require("../../message/services");
const exceptions_1 = require("../exceptions");
const constants_4 = require("../constants");
const providers_2 = require("../providers");
let PurchaseItemService = class PurchaseItemService {
    constructor(PaymentTokenModel, videoModel, queueEventService, productService, performerService, galleryService, settingService, conversationService) {
        this.PaymentTokenModel = PaymentTokenModel;
        this.videoModel = videoModel;
        this.queueEventService = queueEventService;
        this.productService = productService;
        this.performerService = performerService;
        this.galleryService = galleryService;
        this.settingService = settingService;
        this.conversationService = conversationService;
    }
    async findById(id) {
        return this.PaymentTokenModel.findById(id);
    }
    async purchaseProduct(id, user, payload) {
        const product = await this.productService.getDetails(id);
        if (!product)
            throw new kernel_1.EntityNotFoundException();
        let transaction = product.type === constants_3.PRODUCT_TYPE.DIGITAL &&
            (await this.PaymentTokenModel.findOne({
                sourceId: user._id,
                targetId: product._id,
                status: constants_4.PURCHASE_ITEM_STATUS.SUCCESS,
                type: constants_4.PURCHASE_ITEM_TYPE.PRODUCT
            }));
        if (transaction) {
            throw new exceptions_1.ItemHaveBoughtException();
        }
        const quantity = (payload === null || payload === void 0 ? void 0 : payload.quantity) || 1;
        const purchaseToken = product.type === constants_3.PRODUCT_TYPE.DIGITAL
            ? product.token
            : product.token * quantity;
        if (user.balance < purchaseToken)
            throw new exceptions_1.NotEnoughMoneyException();
        if (product.type === constants_3.PRODUCT_TYPE.PHYSICAL && quantity > product.stock) {
            throw new exceptions_1.OverProductStockException();
        }
        if (user.balance < product.token)
            throw new exceptions_1.NotEnoughMoneyException();
        transaction = new this.PaymentTokenModel({
            source: 'user',
            sourceId: user._id,
            target: constants_4.PURCHASE_ITEM_TARGET_TYPE.PRODUCT,
            targetId: product._id,
            sellerId: product.performerId,
            type: constants_4.PURCHASE_ITEM_TYPE.PRODUCT,
            totalPrice: product.token,
            originalPrice: product.token,
            name: product.name,
            description: `Purchase product ${product.name} (x${quantity})`,
            quantity,
            payBy: 'token',
            extraInfo: payload,
            status: constants_4.PURCHASE_ITEM_STATUS.SUCCESS
        });
        await transaction.save();
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: constants_4.PURCHASED_ITEM_SUCCESS_CHANNEL,
            eventName: constants_1.EVENT.CREATED,
            data: transaction
        }));
        return transaction;
    }
    async purchaseVideo(id, user) {
        const video = await this.videoModel.findOne({ _id: id });
        if (!(video === null || video === void 0 ? void 0 : video.isSaleVideo) || !(video === null || video === void 0 ? void 0 : video.token)) {
            throw new kernel_1.EntityNotFoundException();
        }
        let transaction = await this.PaymentTokenModel.findOne({
            sourceId: user._id,
            targetId: video._id,
            status: constants_4.PURCHASE_ITEM_STATUS.SUCCESS
        });
        if (transaction) {
            throw new exceptions_1.ItemHaveBoughtException();
        }
        if (user.balance < video.token)
            throw new exceptions_1.NotEnoughMoneyException();
        transaction = new this.PaymentTokenModel({
            source: 'user',
            sourceId: user._id,
            target: constants_4.PURCHASE_ITEM_TARGET_TYPE.VIDEO,
            targetId: video._id,
            sellerId: video.performerId,
            type: constants_4.PURCHASE_ITEM_TYPE.SALE_VIDEO,
            totalPrice: video.token,
            originalPrice: video.token,
            name: video.title,
            description: `Purchase video ${video.title}`,
            quantity: 1,
            payBy: 'token',
            status: constants_4.PURCHASE_ITEM_STATUS.SUCCESS
        });
        await transaction.save();
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: constants_4.PURCHASED_ITEM_SUCCESS_CHANNEL,
            eventName: constants_1.EVENT.CREATED,
            data: transaction
        }));
        return transaction;
    }
    async buyPhotoGallery(id, user) {
        const gallery = await this.galleryService.findById(id);
        if (!(gallery === null || gallery === void 0 ? void 0 : gallery.token)) {
            throw new kernel_1.EntityNotFoundException();
        }
        let transaction = await this.PaymentTokenModel.findOne({
            sourceId: user._id,
            targetId: gallery._id,
            status: constants_4.PURCHASE_ITEM_STATUS.SUCCESS
        });
        if (transaction) {
            throw new exceptions_1.ItemHaveBoughtException();
        }
        if (user.balance < gallery.token)
            throw new exceptions_1.NotEnoughMoneyException();
        transaction = new this.PaymentTokenModel({
            source: 'user',
            sourceId: user._id,
            target: constants_4.PURCHASE_ITEM_TARGET_TYPE.PHOTO,
            targetId: gallery._id,
            sellerId: gallery.performerId,
            type: constants_4.PURCHASE_ITEM_TYPE.PHOTO,
            totalPrice: gallery.token,
            originalPrice: gallery.token,
            name: gallery.name,
            description: `Purchase gallery ${gallery.name}`,
            quantity: 1,
            payBy: 'token',
            status: constants_4.PURCHASE_ITEM_STATUS.SUCCESS
        });
        await transaction.save();
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: constants_4.PURCHASED_ITEM_SUCCESS_CHANNEL,
            eventName: constants_1.EVENT.CREATED,
            data: transaction
        }));
        return transaction;
    }
    async sendTips(user, performerId, payload) {
        const performer = await this.performerService.findById(performerId);
        if (!performer) {
            throw new kernel_1.EntityNotFoundException();
        }
        if (user.balance < payload.token) {
            throw new exceptions_1.NotEnoughMoneyException();
        }
        const paymentTransaction = new this.PaymentTokenModel();
        paymentTransaction.originalPrice = payload.token;
        paymentTransaction.totalPrice = payload.token;
        paymentTransaction.source = constants_1.ROLE.USER;
        paymentTransaction.sourceId = user._id;
        paymentTransaction.target = constants_4.PURCHASE_ITEM_TARGET_TYPE.TIP;
        paymentTransaction.sellerId = performer._id;
        paymentTransaction.targetId = new mongodb_1.ObjectId(payload.conversationId);
        paymentTransaction.type = constants_4.PURCHASE_ITEM_TYPE.TIP;
        paymentTransaction.name = 'tip';
        paymentTransaction.status = constants_4.PURCHASE_ITEM_STATUS.SUCCESS;
        await paymentTransaction.save();
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: constants_4.PURCHASED_ITEM_SUCCESS_CHANNEL,
            eventName: constants_1.EVENT.CREATED,
            data: paymentTransaction
        }));
        return paymentTransaction;
    }
    async sendPaidToken(user, conversationId) {
        const conversation = await this.conversationService.findById(conversationId);
        if (!conversation) {
            throw new kernel_1.EntityNotFoundException();
        }
        const { performerId, type } = conversation;
        const performer = await this.performerService.findById(conversation.performerId);
        if (!performer) {
            throw new kernel_1.EntityNotFoundException();
        }
        let token;
        let key;
        switch (conversation.type) {
            case 'stream_group':
                token = performer.groupCallPrice;
                key = constants_2.SETTING_KEYS.GROUP_CHAT_DEFAULT_PRICE;
                break;
            case 'stream_private':
                token = performer.privateCallPrice;
                key = constants_2.SETTING_KEYS.PRIVATE_C2C_PRICE;
                break;
            default:
                key = constants_2.SETTING_KEYS.PRIVATE_C2C_PRICE;
                break;
        }
        if (typeof token === 'undefined') {
            token = (await this.settingService.getKeyValue(key)) || 0;
        }
        if (user.balance < token) {
            throw new exceptions_1.NotEnoughMoneyException();
        }
        const paymentTransaction = new this.PaymentTokenModel();
        paymentTransaction.originalPrice = token;
        paymentTransaction.totalPrice = token;
        paymentTransaction.source = constants_1.ROLE.USER;
        paymentTransaction.sourceId = user._id;
        paymentTransaction.target = type;
        paymentTransaction.sellerId = performerId;
        paymentTransaction.targetId = conversation._id;
        paymentTransaction.type = type;
        paymentTransaction.name = type;
        paymentTransaction.status = constants_4.PURCHASE_ITEM_STATUS.SUCCESS;
        await paymentTransaction.save();
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: constants_4.PURCHASED_ITEM_SUCCESS_CHANNEL,
            eventName: constants_1.EVENT.CREATED,
            data: paymentTransaction
        }));
        return paymentTransaction;
    }
};
PurchaseItemService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(providers_2.PURCHASE_ITEM_MODEL_PROVIDER)),
    __param(1, common_1.Inject(providers_1.PERFORMER_VIDEO_MODEL_PROVIDER)),
    __param(2, common_1.Inject(common_1.forwardRef(() => kernel_1.QueueEventService))),
    __param(3, common_1.Inject(common_1.forwardRef(() => services_1.ProductService))),
    __param(4, common_1.Inject(common_1.forwardRef(() => services_2.PerformerService))),
    __param(5, common_1.Inject(common_1.forwardRef(() => services_1.GalleryService))),
    __param(6, common_1.Inject(common_1.forwardRef(() => settings_1.SettingService))),
    __param(7, common_1.Inject(common_1.forwardRef(() => services_3.ConversationService))),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model,
        kernel_1.QueueEventService,
        services_1.ProductService,
        services_2.PerformerService,
        services_1.GalleryService,
        settings_1.SettingService,
        services_3.ConversationService])
], PurchaseItemService);
exports.PurchaseItemService = PurchaseItemService;
//# sourceMappingURL=purchase-item.service.js.map