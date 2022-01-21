"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShippingInfoSchema = void 0;
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
exports.ShippingInfoSchema = new mongoose.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        index: true
    },
    deliveryAddress: String,
    postalCode: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
//# sourceMappingURL=shipping-info.schema.js.map