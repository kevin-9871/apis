"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationMessageSchema = void 0;
const mongoose_1 = require("mongoose");
exports.NotificationMessageSchema = new mongoose_1.Schema({
    conversationId: {
        type: mongoose_1.Schema.Types.ObjectId,
        index: true
    },
    totalNotReadMessage: {
        type: Number,
        default: 0
    },
    recipientId: {
        type: mongoose_1.Schema.Types.ObjectId,
        index: true
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
//# sourceMappingURL=notification-message.schema.js.map