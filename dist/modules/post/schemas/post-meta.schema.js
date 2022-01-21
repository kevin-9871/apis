"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostMetaSchema = void 0;
const mongoose_1 = require("mongoose");
const mongodb_1 = require("mongodb");
exports.PostMetaSchema = new mongoose_1.Schema({
    postId: {
        type: mongodb_1.ObjectId,
        index: true,
        required: true
    },
    key: {
        type: String,
        index: true
    },
    value: mongoose_1.Schema.Types.Mixed,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
//# sourceMappingURL=post-meta.schema.js.map