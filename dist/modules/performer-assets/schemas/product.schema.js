"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductSchema = void 0;
const mongoose_1 = require("mongoose");
const mongodb_1 = require("mongodb");
exports.ProductSchema = new mongoose_1.Schema({
    performerId: {
        type: mongodb_1.ObjectId,
        index: true
    },
    digitalFileId: mongodb_1.ObjectId,
    imageId: mongodb_1.ObjectId,
    name: {
        type: String
    },
    description: String,
    publish: Boolean,
    type: {
        type: String,
        default: 'physical'
    },
    status: {
        type: String,
        default: 'active'
    },
    token: {
        type: Number,
        default: 0
    },
    stock: {
        type: Number,
        default: 0
    },
    createdBy: mongodb_1.ObjectId,
    updatedBy: mongodb_1.ObjectId,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
//# sourceMappingURL=product.schema.js.map