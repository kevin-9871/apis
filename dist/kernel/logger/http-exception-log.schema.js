"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionLogSchema = void 0;
const mongoose = require("mongoose");
exports.HttpExceptionLogSchema = new mongoose.Schema({
    path: String,
    ip: String,
    query: {
        type: mongoose.Schema.Types.Mixed
    },
    body: {
        type: mongoose.Schema.Types.Mixed
    },
    headers: {
        type: mongoose.Schema.Types.Mixed
    },
    authData: {
        type: mongoose.Schema.Types.Mixed
    },
    error: {
        type: mongoose.Schema.Types.Mixed
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'httpexceptionlogs'
});
//# sourceMappingURL=http-exception-log.schema.js.map