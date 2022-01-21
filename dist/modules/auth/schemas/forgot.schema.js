"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgotSchema = void 0;
const mongoose = require("mongoose");
exports.ForgotSchema = new mongoose.Schema({
    authId: {
        type: mongoose.Types.ObjectId,
        index: true
    },
    source: {
        type: String,
        index: true
    },
    sourceId: {
        type: mongoose.Types.ObjectId,
        index: true
    },
    token: {
        type: String,
        index: true
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
    collection: 'forgot'
});
//# sourceMappingURL=forgot.schema.js.map