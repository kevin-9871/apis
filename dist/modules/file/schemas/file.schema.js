"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSchema = void 0;
const mongoose_1 = require("mongoose");
const mongodb_1 = require("mongodb");
exports.FileSchema = new mongoose_1.Schema({
    type: {
        type: String,
        index: true
    },
    name: String,
    description: String,
    mimeType: String,
    server: String,
    path: String,
    absolutePath: String,
    width: Number,
    height: Number,
    duration: Number,
    size: Number,
    status: String,
    encoding: String,
    thumbnails: mongoose_1.Schema.Types.Mixed,
    refItems: [{
            itemId: mongodb_1.ObjectId,
            itemType: String,
            _id: false
        }],
    createdBy: mongodb_1.ObjectId,
    updatedBy: mongodb_1.ObjectId,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
//# sourceMappingURL=file.schema.js.map