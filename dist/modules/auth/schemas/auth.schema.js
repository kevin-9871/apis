"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthSchema = void 0;
const mongoose = require("mongoose");
exports.AuthSchema = new mongoose.Schema({
    source: {
        type: String,
        default: 'user'
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
    key: {
        type: String,
        index: true
    },
    value: String,
    salt: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'auth'
});
//# sourceMappingURL=auth.schema.js.map