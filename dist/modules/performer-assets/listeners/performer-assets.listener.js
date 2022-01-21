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
const constants_1 = require("../constants");
const constants_2 = require("../../../kernel/constants");
const mongoose_1 = require("mongoose");
const services_1 = require("../../file/services");
const constants_3 = require("../constants");
const providers_1 = require("../providers");
const services_2 = require("../services");
const HANDLE_PHOTO_COUNT_FOR_GALLERY = 'HANDLE_PHOTO_COUNT_FOR_GALLERY';
const HANDLE_DELETE_GALLERY = 'HANDLE_DELETE_GALLERY';
let PerformerAssetsListener = class PerformerAssetsListener {
    constructor(queueEventService, photoService, galleryModel) {
        this.queueEventService = queueEventService;
        this.photoService = photoService;
        this.galleryModel = galleryModel;
        this.logger = new common_1.Logger('FileService');
        this.queueEventService.subscribe(constants_3.PERFORMER_PHOTO_CHANNEL, HANDLE_PHOTO_COUNT_FOR_GALLERY, this.handlePhotoCount.bind(this));
        this.queueEventService.subscribe(constants_3.PERFORMER_GALLERY_CHANNEL, HANDLE_DELETE_GALLERY, this.handleDeleteGallery.bind(this));
    }
    async handlePhotoCount(event) {
        try {
            const { eventName } = event;
            if (![constants_2.EVENT.CREATED, constants_2.EVENT.DELETED, constants_2.EVENT.UPDATED].includes(eventName)) {
                return;
            }
            const { galleryId, status, oldStatus, oldGallery } = event.data;
            const difGallery = oldGallery && oldGallery.toString() !== galleryId.toString();
            let increase = 0;
            switch (eventName) {
                case constants_2.EVENT.CREATED:
                    if (status === constants_1.PHOTO_STATUS.ACTIVE)
                        increase = 1;
                    break;
                case constants_2.EVENT.UPDATED:
                    if (difGallery)
                        return;
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
            if (difGallery && eventName === constants_2.EVENT.UPDATED) {
                await Promise.all([
                    oldStatus === constants_1.PHOTO_STATUS.ACTIVE
                        ? this.galleryModel.updateOne({ _id: oldGallery }, {
                            $inc: {
                                numOfItems: -1
                            }
                        })
                        : null,
                    status === constants_1.PHOTO_STATUS.ACTIVE
                        ? this.galleryModel.updateOne({ _id: galleryId }, {
                            $inc: {
                                numOfItems: 1
                            }
                        })
                        : null
                ]);
            }
            if (increase) {
                await this.galleryModel.updateOne({ _id: galleryId }, {
                    $inc: {
                        numOfItems: increase
                    }
                });
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    async handleDeleteGallery(event) {
        try {
            const { eventName, data } = event;
            if (![constants_2.EVENT.DELETED].includes(eventName)) {
                return;
            }
            const { galleryId } = data;
            if (!galleryId)
                return;
            const photos = await this.photoService.find({ galleryId });
            if (photos.length) {
                const ids = photos.map(p => p._id);
                const fileIds = photos.map(p => p.fileId);
                await this.photoService.deleteManyByIds(ids);
                for (const fileId of fileIds) {
                    this.queueEventService.publish(new kernel_1.QueueEvent({
                        channel: services_1.MEDIA_FILE_CHANNEL,
                        eventName: services_1.FILE_EVENT.FILE_RELATED_MODULE_UPDATED,
                        data: { type: services_1.DELETE_FILE_TYPE.FILEID, currentFile: fileId }
                    }));
                }
            }
        }
        catch (e) {
            this.logger.error(e);
        }
    }
};
PerformerAssetsListener = __decorate([
    common_1.Injectable(),
    __param(2, common_1.Inject(providers_1.PERFORMER_GALLERY_MODEL_PROVIDER)),
    __metadata("design:paramtypes", [kernel_1.QueueEventService,
        services_2.PhotoService,
        mongoose_1.Model])
], PerformerAssetsListener);
exports.PerformerAssetsListener = PerformerAssetsListener;
//# sourceMappingURL=performer-assets.listener.js.map