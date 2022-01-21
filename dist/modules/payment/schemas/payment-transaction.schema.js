"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentTransactionSchema = void 0;
const mongoose_1 = require("mongoose");
exports.PaymentTransactionSchema = new mongoose_1.Schema({
    orderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        index: true
    },
    paymentGateway: {
        type: String
    },
    buyerSource: {
        type: String
    },
    buyerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        index: true
    },
    type: {
        type: String,
        index: true
    },
    products: [
        {
            _id: false,
            name: String,
            description: String,
            price: Number,
            productType: String,
            productId: mongoose_1.Schema.Types.ObjectId,
            quantity: Number,
            extraInfo: mongoose_1.Schema.Types.Mixed
        }
    ],
    totalPrice: {
        type: Number,
        default: 0
    },
    paymentResponseInfo: {
        type: mongoose_1.Schema.Types.Mixed
    },
    status: {
        type: String,
        index: true
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
//# sourceMappingURL=payment-transaction.schema.js.map