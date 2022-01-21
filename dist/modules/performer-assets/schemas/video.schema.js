"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoSchema = void 0;
const mongoose_1 = require("mongoose");
const mongodb_1 = require("mongodb");
exports.VideoSchema = new mongoose_1.Schema({
    performerId: {
        type: mongodb_1.ObjectId,
        index: true
    },
    fileId: mongodb_1.ObjectId,
    trailerId: mongodb_1.ObjectId,
    type: {
        type: String,
        index: true
    },
    title: {
        type: String
    },
    description: String,
    status: {
        type: String,
        default: 'active'
    },
    token: {
        type: Number,
        default: 0
    },
    processing: Boolean,
    thumbnailId: mongodb_1.ObjectId,
    isSaleVideo: {
        type: Boolean,
        default: false
    },
    createdBy: mongodb_1.ObjectId,
    updatedBy: mongodb_1.ObjectId,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
//# sourceMappingURL=video.schema.js.map