"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.performerSchema = void 0;
const mongoose = require("mongoose");
exports.performerSchema = new mongoose.Schema({
    name: String,
    firstName: String,
    lastName: String,
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
    streamingStatus: String,
    streamingTitle: String,
    live: {
        type: Boolean,
        default: false,
        index: true
    },
    phoneCode: String,
    avatarId: {
        type: mongoose.Schema.Types.ObjectId,
        index: true
    },
    avatarPath: String,
    idVerificationId: {
        type: mongoose.Schema.Types.ObjectId,
        index: true
    },
    documentVerificationId: {
        type: mongoose.Schema.Types.ObjectId,
        index: true
    },
    releaseFormId: {
        type: mongoose.Schema.Types.ObjectId,
        index: true
    },
    tags: [{ type: String, index: true }],
    gender: {
        type: String,
        index: true
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
    studioId: {
        type: mongoose.Schema.Types.ObjectId,
        index: true
    },
    categoryIds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            index: true
        }
    ],
    schedule: {
        type: mongoose.Schema.Types.Mixed
    },
    timezone: { type: String, index: true },
    noteForUser: String,
    dateOfBirth: Date,
    eyes: String,
    height: String,
    weight: String,
    bio: String,
    sexualReference: String,
    hair: String,
    pubicHair: String,
    ethnicity: String,
    aboutMe: String,
    bust: String,
    bankTransferOption: {
        type: { type: String },
        withdrawCurrency: { type: String },
        taxPayer: { type: String },
        bankName: { type: String },
        bankAddress: { type: String },
        bankCity: { type: String },
        bankState: { type: String },
        bankZip: { type: String },
        bankCountry: { type: String },
        bankAcountNumber: { type: String },
        bankSWIFTBICABA: { type: String },
        holderOfBankAccount: { type: String },
        additionalInformation: { type: String },
        payPalAccount: { type: String },
        checkPayable: { type: String }
    },
    directDeposit: {
        depositFirstName: { type: String },
        depositLastName: { type: String },
        accountingEmail: { type: String },
        directBankName: { type: String },
        accountType: { type: String },
        accountNumber: { type: String },
        routingNumber: { type: String }
    },
    paxum: {
        paxumName: { type: String },
        paxumEmail: { type: String },
        paxumAdditionalInformation: { type: String }
    },
    bitpay: {
        bitpayName: { type: String },
        bitpayEmail: { type: String },
        bitpayAdditionalInformation: { type: String }
    },
    createdBy: mongoose.Schema.Types.ObjectId,
    stats: {
        views: {
            type: Number,
            default: 0
        },
        favorites: {
            type: Number,
            default: 0
        },
        totalVideos: {
            type: Number,
            default: 0
        },
        totalPhotos: {
            type: Number,
            default: 0
        },
        totalGalleries: {
            type: Number,
            default: 0
        },
        totalProducts: {
            type: Number,
            default: 0
        },
        totalStreamTime: {
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
    socials: {
        type: mongoose.Schema.Types.Mixed
    },
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
    balance: {
        type: Number,
        default: 0
    },
    maxParticipantsAllowed: {
        type: Number
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    privateCallPrice: { type: Number, default: 0 },
    groupCallPrice: { type: Number, default: 0 },
    lastStreamingTime: Date
});
//# sourceMappingURL=performer.schema.js.map