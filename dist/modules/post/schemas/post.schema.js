"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostSchema = void 0;
const mongoose_1 = require("mongoose");
const mongodb_1 = require("mongodb");
exports.PostSchema = new mongoose_1.Schema({
    authorId: mongodb_1.ObjectId,
    type: {
        type: String,
        index: true
    },
    title: {
        type: String
    },
    slug: {
        type: String,
        index: true,
        unique: true
    },
    content: String,
    shortDescription: String,
    categoryIds: [{
            type: mongodb_1.ObjectId,
            default: []
        }],
    categorySearchIds: [{
            type: mongodb_1.ObjectId,
            default: []
        }],
    status: {
        type: String,
        default: 'draft'
    },
    image: {
        type: mongoose_1.Schema.Types.Mixed
    },
    createdBy: mongodb_1.ObjectId,
    updatedBy: mongodb_1.ObjectId,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
//# sourceMappingURL=post.schema.js.map