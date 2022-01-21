"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailTemplateSchema = void 0;
const mongoose_1 = require("mongoose");
exports.EmailTemplateSchema = new mongoose_1.Schema({
    name: { type: String },
    description: { type: String, default: '' },
    key: { type: String, index: true, unique: true },
    subject: { type: String },
    content: { type: String, default: '' },
    layout: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
//# sourceMappingURL=email-template.schema.js.map