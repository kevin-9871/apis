"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationSchema = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    type: {
        type: String,
        index: true
    },
    name: String,
    lastMessage: String,
    lastSenderId: mongoose_1.Schema.Types.ObjectId,
    lastMessageCreatedAt: Date,
    recipients: [{
            _id: false,
            source: String,
            sourceId: mongoose_1.Schema.Types.ObjectId
        }],
    performerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        index: true
    },
    streamId: {
        type: mongoose_1.Schema.Types.ObjectId,
        index: true
    },
    meta: mongoose_1.Schema.Types.Mixed,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
schema.index({ recipients: 1 });
exports.ConversationSchema = schema;
//# sourceMappingURL=conversation.schema.js.map