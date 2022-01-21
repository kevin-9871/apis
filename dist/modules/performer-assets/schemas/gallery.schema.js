"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GallerySchema = void 0;
const mongoose_1 = require("mongoose");
const mongodb_1 = require("mongodb");
exports.GallerySchema = new mongoose_1.Schema({
    performerId: {
        type: mongodb_1.ObjectId,
        index: true
    },
    type: {
        type: String,
        index: true
    },
    name: {
        type: String
    },
    description: String,
    status: {
        type: String,
        default: 'active'
    },
    isSale: {
        type: Boolean,
        detault: true
    },
    token: {
        type: Number,
        default: 0
    },
    numOfItems: {
        type: Number,
        default: 0
    },
    coverPhotoId: {
        type: mongodb_1.ObjectId,
        index: true
    },
    createdBy: mongodb_1.ObjectId,
    updatedBy: mongodb_1.ObjectId,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
//# sourceMappingURL=gallery.schema.js.map