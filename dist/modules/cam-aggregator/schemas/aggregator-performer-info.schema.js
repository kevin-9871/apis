"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AggregatorPerfomerSchema = void 0;
const mongoose = require("mongoose");
exports.AggregatorPerfomerSchema = new mongoose.Schema({
    service: {
        type: String,
        index: true
    },
    servicePerformerId: {
        type: String
    },
    gender: {
        type: String,
        index: true
    },
    avatar: String,
    username: {
        type: String,
        index: true
    },
    dateOfBirth: Date,
    age: Number,
    isOnline: Boolean,
    isStreaming: Boolean,
    watching: Number,
    stats: {
        views: {
            type: Number,
            default: 0
        },
        favorites: {
            type: Number,
            default: 0
        }
    },
    streamingStatus: String,
    country: String,
    countryFlag: String,
    city: String,
    languages: [{
            type: String
        }],
    aboutMe: String,
    tags: [{
            type: String,
            index: true
        }],
    iframe: String,
    profileLink: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
//# sourceMappingURL=aggregator-performer-info.schema.js.map