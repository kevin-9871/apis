"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRODUCT_TYPE = exports.DELIVERY_STATUS = exports.ORDER_STATUS = exports.ORDER_UPDATE_CHANNEL = exports.MISSING_CONFIG_PAYMENT_GATEWAY = exports.DIFFERENT_PERFORMER_PRODUCT = exports.OVER_PRODUCT_STOCK = exports.ORDER_PAID_SUCCESS_CHANNEL = exports.TRANSACTION_SUCCESS_CHANNEL = exports.PAYMENT_TARGET_TYPE = exports.PAYMENT_TYPE = exports.PAYMENT_GATEWAY = exports.PAYMENT_STATUS = void 0;
exports.PAYMENT_STATUS = {
    PENDING: 'pending',
    SUCCESS: 'success',
    CANCELLED: 'cancelled'
};
exports.PAYMENT_GATEWAY = {
    CCBILL: 'ccbill',
    EPOCH: 'epoch'
};
exports.PAYMENT_TYPE = {
    MONTHLY_SUBSCRIPTION: 'monthly_subscription',
    YEARLY_SUBSCRIPTION: 'yearly_subscription',
    SALE_VIDEO: 'sale_video',
    PRODUCT: 'product',
    TOKEN: 'token'
};
exports.PAYMENT_TARGET_TYPE = {
    PERFORMER: 'performer',
    PRODUCT: 'product',
    VIDEO: 'video',
    TOKEN: 'token'
};
exports.TRANSACTION_SUCCESS_CHANNEL = 'TRANSACTION_SUCCESS_CHANNEL';
exports.ORDER_PAID_SUCCESS_CHANNEL = 'ORDER_PAID_SUCCESS_CHANNEL';
exports.OVER_PRODUCT_STOCK = 'OVER_PRODUCT_STOCK';
exports.DIFFERENT_PERFORMER_PRODUCT = 'DIFFERENT_PERFORMER_PRODUCT';
exports.MISSING_CONFIG_PAYMENT_GATEWAY = 'MISSING_CONFIG_PAYMENT_GATEWAY';
exports.ORDER_UPDATE_CHANNEL = 'ORDER_UPDATE_CHANNEL';
exports.ORDER_STATUS = {
    PROCESSING: 'processing',
    SHIPPING: 'shipping',
    DELIVERED: 'delivered',
    REFUNDED: 'refunded',
    CREATED: 'created',
    PAID: 'paid'
};
exports.DELIVERY_STATUS = {
    PROCESSING: 'processing',
    SHIPPING: 'shipping',
    DELIVERED: 'delivered',
    CREATED: 'created',
    REFUNDED: 'refunded'
};
exports.PRODUCT_TYPE = {
    MONTHLY_SUBSCRIPTION: 'monthly_subscription',
    YEARLY_SUBSCRIPTION: 'yearly_subscription',
    DIGITAL_PRODUCT: 'digital',
    PHYSICAL_PRODUCT: 'physical',
    TOKEN: 'token'
};
//# sourceMappingURL=constants.js.map