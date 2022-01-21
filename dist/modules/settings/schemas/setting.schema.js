"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingSchema = void 0;
const mongoose_1 = require("mongoose");
exports.SettingSchema = new mongoose_1.Schema({
    key: { type: String, required: true, index: true },
    value: { type: mongoose_1.Schema.Types.Mixed, required: true },
    name: { type: String },
    description: { type: String },
    group: { type: String, default: 'system', required: true },
    public: { type: Boolean, default: false },
    extra: { type: String },
    type: {
        type: String,
        default: 'text'
    },
    visible: {
        type: Boolean,
        default: true
    },
    editable: {
        type: Boolean,
        default: true
    },
    meta: {
        type: mongoose_1.Schema.Types.Mixed
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
//# sourceMappingURL=setting.schema.js.map