"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefundRequestSchema = void 0;
const mongoose_1 = require("mongoose");
const mongodb_1 = require("mongodb");
exports.RefundRequestSchema = new mongoose_1.Schema({
    userId: {
        type: mongodb_1.ObjectId,
        index: true
    },
    sourceType: {
        type: String,
        default: 'product',
        index: true
    },
    sourceId: {
        type: mongodb_1.ObjectId,
        index: true
    },
    token: {
        type: Number,
        default: 0
    },
    performerId: {
        type: mongodb_1.ObjectId,
        index: true
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'resolved', 'rejected'],
        default: 'pending',
        index: true
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
//# sourceMappingURL=refund-request.schema.js.map