"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamSchema = void 0;
const mongoose_1 = require("mongoose");
const mongodb_1 = require("mongodb");
exports.StreamSchema = new mongoose_1.Schema({
    performerId: mongodb_1.ObjectId,
    type: String,
    sessionId: String,
    isStreaming: { type: Boolean, default: false },
    userIds: [{ type: mongodb_1.ObjectId }],
    streamIds: [{ type: String }],
    lastStreamingTime: Date,
    streamingTime: {
        type: Number,
        default: 0
    },
    totalViewer: {
        type: Number,
        default: 0
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
//# sourceMappingURL=stream.schema.js.map