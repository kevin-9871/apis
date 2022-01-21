"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderSchema = void 0;
const mongoose_1 = require("mongoose");
exports.OrderSchema = new mongoose_1.Schema({
    orderNumber: {
        type: String
    },
    buyerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        index: true
    },
    buyerSource: {
        type: String
    },
    sellerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        index: true
    },
    sellerSource: {
        type: String
    },
    sellerUsername: {
        type: String
    },
    type: {
        type: String
    },
    productType: {
        type: String
    },
    productId: {
        type: mongoose_1.Schema.Types.ObjectId,
        index: true
    },
    name: {
        type: String
    },
    description: {
        type: String
    },
    unitPrice: {
        type: Number
    },
    quantity: {
        type: Number
    },
    originalPrice: {
        type: Number
    },
    totalPrice: {
        type: Number
    },
    status: {
        type: String,
        index: true
    },
    deliveryStatus: {
        type: String,
        index: true
    },
    deliveryAddress: {
        type: String
    },
    portalCode: {
        type: String
    },
    paymentStatus: {
        type: String,
        index: true
    },
    payBy: {
        type: String
    },
    couponInfo: {
        type: mongoose_1.Schema.Types.Mixed
    },
    shippingCode: {
        type: String
    },
    extraInfo: {
        type: mongoose_1.Schema.Types.Mixed
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
//# sourceMappingURL=order.schema.js.map