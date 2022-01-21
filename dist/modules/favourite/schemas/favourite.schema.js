"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.favouriteSchema = void 0;
const mongoose_1 = require("mongoose");
const mongodb_1 = require("mongodb");
exports.favouriteSchema = new mongoose_1.Schema({
    favoriteId: { type: mongodb_1.ObjectId, index: true },
    ownerId: { type: mongodb_1.ObjectId, index: true },
    createdAt: {
        type: Date,
        default: new Date()
    },
    updatedAt: {
        type: Date,
        default: new Date()
    }
});
//# sourceMappingURL=favourite.schema.js.map