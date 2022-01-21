"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
const mongoose = require("mongoose");
const mongodb_1 = require("mongodb");
const constants_1 = require("../constants");
exports.UserSchema = new mongoose.Schema({
    name: String,
    firstName: String,
    lastName: String,
    city: String,
    state: String,
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
    phone: {
        type: String
    },
    roles: [{
            type: String,
            default: constants_1.ROLE_USER
        }],
    emailVerified: {
        type: Boolean,
        default: false
    },
    avatarId: mongodb_1.ObjectId,
    avatarPath: String,
    status: {
        type: String,
        default: constants_1.STATUS_ACTIVE
    },
    gender: {
        type: String
    },
    balance: {
        type: Number,
        default: 0
    },
    country: {
        type: String
    },
    timezone: {
        type: String
    },
    dateOfBirth: Date,
    isOnline: {
        type: Boolean,
        default: false
    },
    onlineAt: {
        type: Date
    },
    offlineAt: {
        type: Date
    },
    totalOnlineTime: {
        type: Number,
        default: 0
    },
    stats: {
        totalViewTime: {
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
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
//# sourceMappingURL=user.schema.js.map