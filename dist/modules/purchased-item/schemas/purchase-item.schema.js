"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchasedItemSchema = void 0;
const mongoose_1 = require("mongoose");
exports.PurchasedItemSchema = new mongoose_1.Schema({
    source: {
        type: String
    },
    sourceId: {
        type: mongoose_1.Schema.Types.ObjectId,
        index: true
    },
    target: {
        type: String
    },
    targetId: {
        type: mongoose_1.Schema.Types.ObjectId,
        index: true
    },
    sellerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        index: true
    },
    name: String,
    description: String,
    price: Number,
    quantity: Number,
    type: String,
    totalPrice: {
        type: Number,
        default: 0
    },
    originalPrice: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        index: true
    },
    extraInfo: mongoose_1.Schema.Types.Mixed,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
//# sourceMappingURL=purchase-item.schema.js.map