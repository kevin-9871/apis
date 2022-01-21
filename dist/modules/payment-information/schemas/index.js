"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentInformationSchema = void 0;
const mongoose_1 = require("mongoose");
const mongodb_1 = require("mongodb");
const constants_1 = require("../constants");
exports.paymentInformationSchema = new mongoose_1.Schema({
    sourceId: {
        type: mongodb_1.ObjectId,
        index: true
    },
    sourceType: {
        type: String,
        default: constants_1.BANKING_SOURCE.PERFORMER,
        index: true
    },
    type: {
        type: String,
        index: true,
        enum: [
            constants_1.BANKING_TYPE.BITPAY,
            constants_1.BANKING_TYPE.DEPOSIT,
            constants_1.BANKING_TYPE.ISSUE,
            constants_1.BANKING_TYPE.PAYONNEER,
            constants_1.BANKING_TYPE.PAYPAL,
            constants_1.BANKING_TYPE.WIRE,
            constants_1.BANKING_TYPE.PAXUM
        ]
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
    strict: false
});
//# sourceMappingURL=index.js.map