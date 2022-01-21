"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformerAssetsListener = void 0;
const common_1 = require("@nestjs/common");
const kernel_1 = require("../../../kernel");
const constants_1 = require("../../performer-assets/constants");
const mongoose_1 = require("mongoose");
const constants_2 = require("../../../kernel/constants");
const providers_1 = require("../providers");
const HANDLE_PHOTO_COUNT_FOR_PERFORMER = 'HANDLE_PHOTO_COUNT_FOR_PERFORMER';
let PerformerAssetsListener = class PerformerAssetsListener {
    constructor(queueEventService, performerModel) {
        this.queueEventService = queueEventService;
        this.performerModel = performerModel;
        this.queueEventService.subscribe(constants_1.PERFORMER_PHOTO_CHANNEL, HANDLE_PHOTO_COUNT_FOR_PERFORMER, this.handlePhotoCount.bind(this));
        this.queueEventService.subscribe(constants_1.PERFORMER_VIDEO_CHANNEL, HANDLE_PHOTO_COUNT_FOR_PERFORMER, this.handleVideoCount.bind(this));
        this.queueEventService.subscribe(constants_1.PERFORMER_PRODUCT_CHANNEL, HANDLE_PHOTO_COUNT_FOR_PERFORMER, this.handleProductCount.bind(this));
    }
    async handlePhotoCount(event) {
        try {
            const { eventName } = event;
            if (![constants_2.EVENT.CREATED, constants_2.EVENT.DELETED, constants_2.EVENT.UPDATED].includes(eventName)) {
                return;
            }
            const { performerId, status, oldStatus } = event.data;
            let increase = 0;
            switch (eventName) {
                case constants_2.EVENT.CREATED:
                    if (status === constants_1.PHOTO_STATUS.ACTIVE)
                        increase = 1;
                    break;
                case constants_2.EVENT.UPDATED:
                    if (oldStatus !== constants_1.PHOTO_STATUS.ACTIVE &&
                        status === constants_1.PHOTO_STATUS.ACTIVE)
                        increase = 1;
                    if (oldStatus === constants_1.PHOTO_STATUS.ACTIVE &&
                        status !== constants_1.PHOTO_STATUS.ACTIVE)
                        increase = -1;
                    break;
                case constants_2.EVENT.DELETED:
                    if (status === constants_1.PHOTO_STATUS.ACTIVE)
                        increase = -1;
                    break;
                default:
                    break;
            }
            if (increase) {
                await this.performerModel.updateOne({ _id: performerId }, {
                    $inc: {
                        'stats.totalPhotos': increase
                    }
                });
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    async handleVideoCount(event) {
        try {
            const { eventName } = event;
            if (![constants_2.EVENT.CREATED, constants_2.EVENT.DELETED, constants_2.EVENT.UPDATED].includes(eventName)) {
                return;
            }
            const { performerId, status, oldStatus } = event.data;
            let increase = 0;
            switch (eventName) {
                case constants_2.EVENT.CREATED:
                    if (status === constants_1.VIDEO_STATUS.ACTIVE)
                        increase = 1;
                    break;
                case constants_2.EVENT.UPDATED:
                    if (oldStatus !== constants_1.VIDEO_STATUS.ACTIVE &&
                        status === constants_1.VIDEO_STATUS.ACTIVE)
                        increase = 1;
                    if (oldStatus === constants_1.VIDEO_STATUS.ACTIVE &&
                        status !== constants_1.VIDEO_STATUS.ACTIVE)
                        increase = -1;
                    break;
                case constants_2.EVENT.DELETED:
                    if (status === constants_1.VIDEO_STATUS.ACTIVE)
                        increase = -1;
                    break;
                default:
                    break;
            }
            if (increase) {
                await this.performerModel.updateOne({ _id: performerId }, {
                    $inc: {
                        'stats.totalVideos': increase
                    }
                });
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    async handleProductCount(event) {
        try {
            const { eventName } = event;
            if (![constants_2.EVENT.CREATED, constants_2.EVENT.DELETED, constants_2.EVENT.UPDATED].includes(eventName)) {
                return;
            }
            const { performerId, status, oldStatus } = event.data;
            let increase = 0;
            switch (eventName) {
                case constants_2.EVENT.CREATED:
                    if (status === constants_1.PRODUCT_STATUS.ACTIVE)
                        increase = 1;
                    break;
                case constants_2.EVENT.UPDATED:
                    if (oldStatus !== constants_1.PRODUCT_STATUS.ACTIVE &&
                        status === constants_1.PRODUCT_STATUS.ACTIVE)
                        increase = 1;
                    if (oldStatus === constants_1.PRODUCT_STATUS.ACTIVE &&
                        status !== constants_1.PRODUCT_STATUS.ACTIVE)
                        increase = -1;
                    break;
                case constants_2.EVENT.DELETED:
                    if (status === constants_1.PRODUCT_STATUS.ACTIVE)
                        increase = -1;
                    break;
                default:
                    break;
            }
            if (increase) {
                await this.performerModel.updateOne({ _id: performerId }, {
                    $inc: {
                        'stats.totalProducts': increase
                    }
                });
            }
        }
        catch (e) {
            console.log(e);
        }
    }
};
PerformerAssetsListener = __decorate([
    common_1.Injectable(),
    __param(1, common_1.Inject(providers_1.PERFORMER_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [kernel_1.QueueEventService,
        mongoose_1.Model])
], PerformerAssetsListener);
exports.PerformerAssetsListener = PerformerAssetsListener;
//# sourceMappingURL=performer-assets.listener.js.map