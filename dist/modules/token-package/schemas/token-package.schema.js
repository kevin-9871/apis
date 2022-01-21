"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenPackageSchema = void 0;
const mongoose_1 = require("mongoose");
exports.tokenPackageSchema = new mongoose_1.Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    ordering: {
        type: Number,
        default: 0
    },
    price: Number,
    tokens: Number,
    pi_code: String,
    isActive: { type: Boolean, default: false },
    updatedAt: {
        type: Date,
        default: new Date()
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
});
//# sourceMappingURL=token-package.schema.js.map