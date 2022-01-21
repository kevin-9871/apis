"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationSchema = void 0;
const mongoose = require("mongoose");
exports.VerificationSchema = new mongoose.Schema({
    sourceType: {
        type: String,
        default: 'user',
        index: true
    },
    sourceId: {
        type: mongoose.Types.ObjectId,
        index: true
    },
    type: {
        type: String,
        default: 'email',
        index: true
    },
    value: {
        type: String,
        index: true
    },
    token: {
        type: String,
        index: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'verifications'
});
//# sourceMappingURL=verification.schema.js.map