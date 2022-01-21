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
exports.PhotoService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const file_1 = require("../../file");
const dtos_1 = require("../../user/dtos");
const services_1 = require("../../file/services");
const lodash_1 = require("lodash");
const services_2 = require("../../performer/services");
const constants_1 = require("../../../kernel/constants");
const services_3 = require("../../purchased-item/services");
const constants_2 = require("../../purchased-item/constants");
const services_4 = require("../../auth/services");
const constants_3 = require("../constants");
const dtos_2 = require("../dtos");
const gallery_service_1 = require("./gallery.service");
const providers_1 = require("../providers");
const FILE_PROCESSED_TOPIC = 'FILE_PROCESSED';
const UPDATE_DEFAULT_COVER_GALLERY = 'UPDATE_DEFAULT_COVER_GALLERY';
let PhotoService = class PhotoService {
    constructor(PhotoModel, queueEventService, fileService, authService, paymentTokenService, galleryService, performerService) {
        this.PhotoModel = PhotoModel;
        this.queueEventService = queueEventService;
        this.fileService = fileService;
        this.authService = authService;
        this.paymentTokenService = paymentTokenService;
        this.galleryService = galleryService;
        this.performerService = performerService;
        this.queueEventService.subscribe(constants_3.PERFORMER_PHOTO_CHANNEL, FILE_PROCESSED_TOPIC, this.handleFileProcessed.bind(this));
        this.queueEventService.subscribe(constants_3.PERFORMER_PHOTO_CHANNEL, UPDATE_DEFAULT_COVER_GALLERY, this.handleDefaultCoverGallery.bind(this));
    }
    async find(condition = {}) {
        return this.PhotoModel.find(condition);
    }
    async handleFileProcessed(event) {
        try {
            if (event.eventName !== services_1.FILE_EVENT.PHOTO_PROCESSED)
                return;
            const { photoId } = event.data.meta;
            const [photo, file] = await Promise.all([
                this.PhotoModel.findById(photoId),
                this.fileService.findById(event.data.fileId)
            ]);
            if (!photo) {
                return;
            }
            photo.processing = false;
            if (file.status === 'error') {
                photo.status = constants_3.PHOTO_STATUS.FILE_ERROR;
            }
            await photo.save();
        }
        catch (e) {
            console.log(e);
        }
    }
    async create(file, payload, creator) {
        if (!file)
            throw new Error('File is valid!');
        if (!file.isImage()) {
            await this.fileService.removeIfNotHaveRef(file._id);
            throw new Error('Invalid image!');
        }
        const photo = new this.PhotoModel(payload);
        if (!photo.title)
            photo.title = file.name;
        photo.fileId = file._id;
        if (creator) {
            photo.createdBy = creator._id;
            photo.updatedBy = creator._id;
        }
        photo.processing = true;
        await photo.save();
        await Promise.all([
            this.fileService.addRef(file._id, {
                itemType: 'performer-photo',
                itemId: photo._id
            }),
            this.fileService.queueProcessPhoto(file._id, {
                meta: {
                    photoId: photo._id
                },
                publishChannel: constants_3.PERFORMER_PHOTO_CHANNEL,
                thumbnailSize: {
                    width: 250,
                    height: 250
                }
            })
        ]);
        const dto = new dtos_2.PhotoDto(photo);
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: constants_3.PERFORMER_PHOTO_CHANNEL,
            eventName: constants_1.EVENT.CREATED,
            data: dto
        }));
        return dto;
    }
    async updateInfo(id, payload, file, updater) {
        const photo = await this.PhotoModel.findById(id);
        if (!photo) {
            throw new kernel_1.EntityNotFoundException();
        }
        const oldStatus = photo.status;
        const oldGallery = photo.galleryId;
        const currentFile = photo.fileId;
        if (file) {
            if (!file.isImage) {
                await this.fileService.removeIfNotHaveRef(file._id);
                throw new Error('Invalid image!');
            }
            photo.fileId = file._id;
        }
        lodash_1.merge(photo, payload);
        if (photo.status !== constants_3.PHOTO_STATUS.FILE_ERROR &&
            payload.status !== constants_3.PHOTO_STATUS.FILE_ERROR) {
            photo.status = payload.status;
        }
        updater && photo.set('updatedBy', updater._id);
        photo.updatedAt = new Date();
        await photo.save();
        if (file && file.isImage()) {
            await Promise.all([
                this.fileService.addRef(file._id, {
                    itemType: 'performer-photo',
                    itemId: photo._id
                }),
                this.fileService.queueProcessPhoto(file._id, {
                    meta: {
                        photoId: photo._id
                    },
                    publishChannel: constants_3.PERFORMER_PHOTO_CHANNEL,
                    thumbnailSize: {
                        width: 250,
                        height: 250
                    }
                }),
                this.queueEventService.publish(new kernel_1.QueueEvent({
                    channel: services_1.MEDIA_FILE_CHANNEL,
                    eventName: services_1.FILE_EVENT.FILE_RELATED_MODULE_UPDATED,
                    data: {
                        type: services_1.DELETE_FILE_TYPE.FILEID,
                        currentFile,
                        newFile: file._id
                    }
                }))
            ]);
        }
        const dto = new dtos_2.PhotoDto(photo);
        this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: constants_3.PERFORMER_PHOTO_CHANNEL,
            eventName: constants_1.EVENT.UPDATED,
            data: Object.assign(Object.assign({}, dto), { oldStatus,
                oldGallery })
        }));
        return dto;
    }
    async details(id, jwToken) {
        const photo = await this.PhotoModel.findOne({ _id: id });
        if (!photo) {
            throw new kernel_1.EntityNotFoundException();
        }
        const dto = new dtos_2.PhotoDto(photo);
        const [performer, gallery, file] = await Promise.all([
            photo.performerId
                ? this.performerService.findById(photo.performerId)
                : null,
            photo.galleryId ? this.galleryService.findById(photo.galleryId) : null,
            photo.fileId ? this.fileService.findById(photo.fileId) : null
        ]);
        if (performer)
            dto.performer = { username: performer.username };
        if (gallery)
            dto.gallery = new dtos_2.GalleryDto(gallery);
        if (file) {
            dto.photo = {
                url: jwToken
                    ? `${file.getUrl()}?galleryId=${photo.galleryId}&token=${jwToken}`
                    : `${file.getUrl()}?galleryId=${photo.galleryId}&token=${jwToken}`,
                thumbnails: file.getThumbnails(),
                width: file.width,
                height: file.height
            };
        }
        return dto;
    }
    async delete(id) {
        const photo = await this.PhotoModel.findById(id);
        if (!photo) {
            throw new kernel_1.EntityNotFoundException();
        }
        const dto = new dtos_2.PhotoDto(photo);
        await photo.remove();
        photo.fileId && await this.fileService.remove(photo.fileId);
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: constants_3.PERFORMER_PHOTO_CHANNEL,
            eventName: constants_1.EVENT.DELETED,
            data: dto
        }));
        return true;
    }
    async deleteMany(condition) {
        return this.PhotoModel.deleteMany(condition);
    }
    deleteManyByIds(ids) {
        return this.PhotoModel.deleteMany({ _id: { $in: ids } });
    }
    async handleDefaultCoverGallery(event) {
        if (![constants_1.EVENT.CREATED, constants_1.EVENT.UPDATED].includes(event.eventName)) {
            return;
        }
        const photo = event.data;
        if (!photo.galleryId)
            return;
        const defaultCover = await this.PhotoModel.findOne({
            galleryId: photo.galleryId,
            status: constants_3.PHOTO_STATUS.ACTIVE
        });
        await this.galleryService.updateCover(photo.galleryId, defaultCover ? defaultCover._id : null);
        const photoCover = await this.PhotoModel.findOne({
            galleryId: photo.galleryId,
            isGalleryCover: true
        });
        if (!defaultCover ||
            (photoCover && photoCover._id.toString() === defaultCover.toString()))
            return;
        await this.PhotoModel.updateOne({ _id: defaultCover._id }, {
            isGalleryCover: true
        });
    }
    async checkAuth(req) {
        const { query: { galleryId, token } } = req;
        const gallery = galleryId && (await this.galleryService.findById(galleryId));
        if (!gallery) {
            return false;
        }
        if (!gallery.isSale) {
            return true;
        }
        if (!token) {
            return false;
        }
        const user = await this.authService.getSourceFromJWT(token);
        if (!user) {
            return false;
        }
        if (user.roles && user.roles.includes('admin')) {
            return true;
        }
        if (user._id.toString() === gallery.performerId.toString()) {
            return true;
        }
        const checkBought = await this.paymentTokenService.checkBought(gallery._id, constants_2.PurchaseItemType.PHOTO, user);
        if (checkBought) {
            return true;
        }
        return false;
    }
};
PhotoService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(providers_1.PERFORMER_PHOTO_MODEL_PROVIDER)),
    __param(2, common_1.Inject(common_1.forwardRef(() => services_1.FileService))),
    __param(3, common_1.Inject(common_1.forwardRef(() => services_4.AuthService))),
    __param(4, common_1.Inject(common_1.forwardRef(() => services_3.PaymentTokenService))),
    __param(5, common_1.Inject(common_1.forwardRef(() => gallery_service_1.GalleryService))),
    __param(6, common_1.Inject(common_1.forwardRef(() => services_2.PerformerService))),
    __metadata("design:paramtypes", [mongoose_1.Model,
        kernel_1.QueueEventService,
        services_1.FileService,
        services_4.AuthService,
        services_3.PaymentTokenService,
        gallery_service_1.GalleryService,
        services_2.PerformerService])
], PhotoService);
exports.PhotoService = PhotoService;
//# sourceMappingURL=photo.service.js.map