"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.earningSchema = void 0;
const mongoose = require("mongoose");
exports.earningSchema = new mongoose.Schema({
    transactionTokenId: {
        type: mongoose.Schema.Types.ObjectId,
        index: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        index: true
    },
    performerId: {
        type: mongoose.Schema.Types.ObjectId,
        index: true
    },
    sourceId: {
        type: mongoose.Schema.Types.ObjectId,
        index: true
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        index: true
    },
    type: {
        type: String,
        index: true
    },
    source: {
        type: String,
        index: true
    },
    target: {
        type: String,
        index: true
    },
    grossPrice: {
        type: Number,
        default: 0
    },
    netPrice: {
        type: Number,
        default: 0
    },
    commission: {
        type: Number,
        default: 20
    },
    studio: {},
    isPaid: {
        type: Boolean,
        default: false,
        index: true
    },
    transactionStatus: {
        type: String,
        index: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    paidAt: {
        type: Date
    },
    conversionRate: {
        type: Number,
        default: 1
    }
});
//# sourceMappingURL=earning.schema.js.map