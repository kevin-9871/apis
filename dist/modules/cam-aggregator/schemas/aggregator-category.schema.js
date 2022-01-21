"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AggregatorCategorySchema = void 0;
const mongoose = require("mongoose");
exports.AggregatorCategorySchema = new mongoose.Schema({
    name: String,
    alias: {
        type: String,
        index: true,
        unique: true
    },
    active: {
        type: Boolean,
        default: 'true'
    },
    tags: [{
            type: String
        }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
//# sourceMappingURL=aggregator-category.schema.js.map