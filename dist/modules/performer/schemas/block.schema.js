"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockSettingSchema = void 0;
const mongodb_1 = require("mongodb");
const mongoose_1 = require("mongoose");
exports.BlockSettingSchema = new mongoose_1.Schema({
    performerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        index: true
    },
    countries: [{ type: String, index: true }],
    userIds: [{
            type: mongodb_1.ObjectId, index: true
        }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
exports.BlockSettingSchema.index({ countries: 1 });
//# sourceMappingURL=block.schema.js.map