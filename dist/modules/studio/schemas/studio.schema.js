"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studioSchema = void 0;
const mongodb_1 = require("mongodb");
const mongoose_1 = require("mongoose");
exports.studioSchema = new mongoose_1.Schema({
    name: String,
    username: {
        type: String,
        index: true,
        lowercase: true,
        unique: true,
        trim: true,
        sparse: true
    },
    email: {
        type: String,
        index: true,
        unique: true,
        lowercase: true,
        trim: true,
        sparse: true
    },
    status: {
        type: String,
        index: true
    },
    phone: {
        type: String
    },
    country: {
        type: String,
        index: true
    },
    city: String,
    state: String,
    zipcode: String,
    address: String,
    languages: [
        {
            type: String,
            index: true
        }
    ],
    timezone: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    balance: {
        type: Number,
        default: 0
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    roles: [
        {
            type: String,
            default: 'studio'
        }
    ],
    stats: {
        totalPerformer: {
            type: Number,
            default: 0
        },
        totalHoursOnline: {
            type: Number,
            default: 0
        },
        totalTokenEarned: {
            type: Number,
            default: 0
        },
        totalTokenSpent: {
            type: Number,
            default: 0
        }
    },
    documentVerificationId: {
        type: mongodb_1.ObjectId,
        index: true
    },
    commission: {
        type: Number,
        default: 30
    }
});
//# sourceMappingURL=studio.schema.js.map