"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.payoutRequestSchema = void 0;
const mongoose_1 = require("mongoose");
const mongodb_1 = require("mongodb");
exports.payoutRequestSchema = new mongoose_1.Schema({
    source: {
        index: true,
        type: String,
        enum: ['performer', 'studio']
    },
    sourceId: {
        index: true,
        type: mongodb_1.ObjectId
    },
    performerId: {
        type: mongodb_1.ObjectId,
        index: true
    },
    studioRequestId: {
        type: mongodb_1.ObjectId,
        index: true
    },
    studioId: {
        type: mongodb_1.ObjectId,
        index: true
    },
    paymentAccountType: {
        type: String,
        enum: ['wire', 'paypal', 'issue_check_us', 'deposit', 'payoneer', 'bitpay'],
        index: true
    },
    fromDate: {
        type: Date
    },
    toDate: {
        type: Date
    },
    requestNote: {
        type: String
    },
    adminNote: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'done'],
        default: 'pending',
        index: true
    },
    sourceType: {
        type: String,
        enum: ['performer', 'studio'],
        index: true
    },
    tokenMustPay: {
        type: Number,
        default: 0
    },
    previousPaidOut: {
        type: Number,
        default: 0
    },
    pendingToken: {
        type: Number,
        default: 0
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
//# sourceMappingURL=payout-request.schema.js.map