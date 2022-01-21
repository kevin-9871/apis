"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.performerCommissionSchema = void 0;
const mongoose_1 = require("mongoose");
exports.performerCommissionSchema = new mongoose_1.Schema({
    performerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        index: true
    },
    studioCommission: {
        type: Number,
        default: 0
    },
    memberCommission: {
        type: Number,
        default: 0
    },
    tipCommission: {
        type: Number,
        default: 20
    },
    privateCallCommission: {
        type: Number,
        default: 20
    },
    groupCallCommission: {
        type: Number,
        default: 20
    },
    productCommission: {
        type: Number,
        default: 20
    },
    albumCommission: {
        type: Number,
        default: 20
    },
    videoCommission: {
        type: Number,
        default: 20
    },
    createdBy: mongoose_1.Schema.Types.ObjectId,
    updatedBy: mongoose_1.Schema.Types.ObjectId,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
//# sourceMappingURL=performer-commission.schema.js.map