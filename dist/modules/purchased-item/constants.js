"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ITEM_NOT_PURCHASED = exports.OVER_PRODUCT_STOCK = exports.PURCHASED_ITEM_SUCCESS_CHANNEL = exports.PURCHASE_ITEM_TARGET_SOURCE = exports.ORDER_TOKEN_STATUS = exports.PURCHASE_ITEM_TARGET_TYPE = exports.PURCHASE_ITEM_STATUS = exports.PurchaseItemType = exports.PURCHASE_ITEM_TYPE = void 0;
exports.PURCHASE_ITEM_TYPE = {
    SALE_VIDEO: 'sale_video',
    PRODUCT: 'sale_product',
    PHOTO: 'sale_photo',
    TIP: 'tip',
    PRIVATE: 'stream_private',
    GROUP: 'stream_group'
};
var PurchaseItemType;
(function (PurchaseItemType) {
    PurchaseItemType["SALE_VIDEO"] = "sale_video";
    PurchaseItemType["PRODUCT"] = "sale_product";
    PurchaseItemType["PHOTO"] = "sale_photo";
    PurchaseItemType["TIP"] = "tip";
    PurchaseItemType["PRIVATE"] = "stream_private";
    PurchaseItemType["GROUP"] = "stream_group";
})(PurchaseItemType = exports.PurchaseItemType || (exports.PurchaseItemType = {}));
exports.PURCHASE_ITEM_STATUS = {
    PENDING: 'pending',
    SUCCESS: 'success',
    CANCELLED: 'cancelled'
};
exports.PURCHASE_ITEM_TARGET_TYPE = {
    PRODUCT: 'product',
    VIDEO: 'video',
    PHOTO: 'photo',
    TIP: 'tip',
    PRIVATE: 'stream_private',
    GROUP: 'stream_group'
};
exports.ORDER_TOKEN_STATUS = {
    PROCESSING: 'processing',
    SHIPPING: 'shipping',
    DELIVERED: 'delivered',
    REFUNDED: 'refunded'
};
var PURCHASE_ITEM_TARGET_SOURCE;
(function (PURCHASE_ITEM_TARGET_SOURCE) {
    PURCHASE_ITEM_TARGET_SOURCE["USER"] = "user";
})(PURCHASE_ITEM_TARGET_SOURCE = exports.PURCHASE_ITEM_TARGET_SOURCE || (exports.PURCHASE_ITEM_TARGET_SOURCE = {}));
exports.PURCHASED_ITEM_SUCCESS_CHANNEL = 'PURCHASED_ITEM_SUCCESS_CHANNEL';
exports.OVER_PRODUCT_STOCK = 'OVER_PRODUCT_STOCK';
exports.ITEM_NOT_PURCHASED = 'ITEM_NOT_PURCHASED';
//# sourceMappingURL=constants.js.map