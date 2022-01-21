"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannerSchema = void 0;
const mongoose_1 = require("mongoose");
const mongodb_1 = require("mongodb");
const constants_1 = require("../constants");
exports.BannerSchema = new mongoose_1.Schema({
    fileId: mongodb_1.ObjectId,
    type: {
        type: String,
        enum: [constants_1.BANNER_TYPE.IMG, constants_1.BANNER_TYPE.HTML],
        default: constants_1.BANNER_TYPE.IMG
    },
    contentHTML: String,
    title: {
        type: String
    },
    href: String,
    description: { type: String },
    processing: Boolean,
    status: {
        type: String,
        default: 'active'
    },
    position: { type: String, default: 'top' },
    createdBy: mongodb_1.ObjectId,
    updatedBy: mongodb_1.ObjectId,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
//# sourceMappingURL=banner.schema.js.map