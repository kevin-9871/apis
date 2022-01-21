"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategorySchema = void 0;
const mongoose_1 = require("mongoose");
const mongodb_1 = require("mongodb");
exports.CategorySchema = new mongoose_1.Schema({
    type: {
        type: String,
        index: true
    },
    parentId: {
        type: mongodb_1.ObjectId,
        index: true
    },
    title: String,
    slug: {
        type: String,
        index: true
    },
    description: String,
    createdBy: mongodb_1.ObjectId,
    updatedBy: mongodb_1.ObjectId,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
//# sourceMappingURL=category.schema.js.map