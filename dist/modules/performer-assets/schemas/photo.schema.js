"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhotoSchema = void 0;
const mongoose_1 = require("mongoose");
const mongodb_1 = require("mongodb");
exports.PhotoSchema = new mongoose_1.Schema({
    performerId: {
        type: mongodb_1.ObjectId,
        index: true
    },
    galleryId: {
        type: mongodb_1.ObjectId,
        index: true
    },
    fileId: mongodb_1.ObjectId,
    title: {
        type: String
    },
    description: String,
    status: {
        type: String,
        default: 'active'
    },
    processing: Boolean,
    isGalleryCover: {
        type: Boolean,
        default: false
    },
    createdBy: mongodb_1.ObjectId,
    updatedBy: mongodb_1.ObjectId,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
//# sourceMappingURL=photo.schema.js.map