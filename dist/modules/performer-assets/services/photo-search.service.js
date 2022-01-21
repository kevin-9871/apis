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
exports.PhotoSearchService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const services_1 = require("../../performer/services");
const services_2 = require("../../file/services");
const services_3 = require("../../purchased-item/services");
const constants_1 = require("../../purchased-item/constants");
const dtos_1 = require("../../user/dtos");
const exceptions_1 = require("../../purchased-item/exceptions");
const gallery_service_1 = require("./gallery.service");
const dtos_2 = require("../dtos");
const providers_1 = require("../providers");
let PhotoSearchService = class PhotoSearchService {
    constructor(photoModel, performerService, galleryService, fileService, paymentTokenService) {
        this.photoModel = photoModel;
        this.performerService = performerService;
        this.galleryService = galleryService;
        this.fileService = fileService;
        this.paymentTokenService = paymentTokenService;
    }
    async adminSearch(req, jwToken) {
        const query = {};
        if (req.q)
            query.title = { $regex: req.q };
        if (req.performerId)
            query.performerId = req.performerId;
        if (req.galleryId)
            query.galleryId = req.galleryId;
        if (req.status)
            query.status = req.status;
        let sort = {};
        if (req.sort && req.sortBy) {
            sort = {
                [req.sortBy]: req.sort
            };
        }
        const [data, total] = await Promise.all([
            this.photoModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(parseInt(req.limit, 10))
                .skip(parseInt(req.offset, 10)),
            this.photoModel.countDocuments(query)
        ]);
        const performerIds = data.map(d => d.performerId);
        const galleryIds = data.map(d => d.galleryId);
        const fileIds = data.map(d => d.fileId);
        const [performers, galleries, files] = await Promise.all([
            performerIds.length ? this.performerService.findByIds(performerIds) : [],
            galleryIds.length ? this.galleryService.findByIds(galleryIds) : [],
            fileIds.length ? this.fileService.findByIds(fileIds) : []
        ]);
        const photos = data.map(photo => {
            const performer = photo.performerId &&
                performers.find(p => p._id.toString() === photo.performerId.toString());
            const gallery = photo.galleryId &&
                galleries.find(p => p._id.toString() === photo.galleryId.toString());
            const file = photo.fileId &&
                files.find(f => f._id.toString() === photo.fileId.toString());
            return Object.assign(Object.assign({}, photo), { gallery, performer: performer && { username: performer.username }, photo: file && {
                    thumbnails: file.getThumbnails(),
                    url: jwToken
                        ? `${file.getUrl()}?galleryId=${photo.galleryId}&token=${jwToken}`
                        : `${file.getUrl()}?galleryId=${photo.galleryId}`,
                    width: file.width,
                    height: file.height,
                    mimeType: file.mimeType
                } });
        });
        return {
            data: photos && photos.map(v => new dtos_2.PhotoDto(v)),
            total
        };
    }
    async userSearch(galleryId, req, user, jwToken) {
        const gallery = await this.galleryService.findById(galleryId);
        if (!gallery) {
            throw new kernel_1.EntityNotFoundException();
        }
        if (gallery.isSale) {
            const payment = await this.paymentTokenService.findByQuery({
                sourceId: user._id,
                targetId: galleryId,
                target: constants_1.PURCHASE_ITEM_TARGET_TYPE.PHOTO,
                status: constants_1.PURCHASE_ITEM_STATUS.SUCCESS
            });
            if (!payment) {
                throw new exceptions_1.ItemNotPurchasedException();
            }
        }
        const query = {};
        query.galleryId = galleryId;
        query.status = 'active';
        let sort = {};
        if (req.sort && req.sortBy) {
            sort = {
                [req.sortBy]: req.sort
            };
        }
        const [data, total] = await Promise.all([
            this.photoModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(parseInt(req.limit, 10))
                .skip(parseInt(req.offset, 10)),
            this.photoModel.countDocuments(query)
        ]);
        const performerIds = data.map(d => d.performerId);
        const galleryIds = data.map(d => d.galleryId);
        const fileIds = data.map(d => d.fileId);
        const [performers, galleries, files] = await Promise.all([
            performerIds.length ? this.performerService.findByIds(performerIds) : [],
            galleryIds.length ? this.galleryService.findByIds(galleryIds) : [],
            fileIds.length ? this.fileService.findByIds(fileIds) : []
        ]);
        const photos = data.map(photo => {
            const performer = photo.performerId &&
                performers.find(p => p._id.toString() === photo.performerId.toString());
            const photoGallery = photo.galleryId &&
                galleries.find(p => p._id.toString() === photo.galleryId.toString());
            const file = photo.fileId &&
                files.find(f => f._id.toString() === photo.fileId.toString());
            return Object.assign(Object.assign({}, photo), { gallery: photoGallery, performer: performer && { username: performer.username }, photo: file && {
                    thumbnails: file.getThumbnails(),
                    url: jwToken
                        ? `${file.getUrl()}?galleryId=${photo.galleryId}&token=${jwToken}`
                        : `${file.getUrl()}?galleryId=${photo.galleryId}`,
                    width: file.width,
                    height: file.height,
                    mimeType: file.mimeType
                } });
        });
        return {
            data: photos.map(v => new dtos_2.PhotoDto(v).toPublic()),
            total
        };
    }
    async performerSearch(req, user, jwToken) {
        const query = {};
        if (req.q)
            query.title = { $regex: req.q };
        query.performerId = user._id;
        if (req.galleryId)
            query.galleryId = req.galleryId;
        if (req.status)
            query.status = req.status;
        const [data, total] = await Promise.all([
            this.photoModel
                .find(query)
                .lean()
                .sort('-createdAt')
                .limit(parseInt(req.limit, 10))
                .skip(parseInt(req.offset, 10)),
            this.photoModel.countDocuments(query)
        ]);
        const performerIds = data.map(d => d.performerId);
        const galleryIds = data.map(d => d.galleryId);
        const fileIds = data.map(d => d.fileId);
        const [performers, galleries, files] = await Promise.all([
            performerIds.length ? this.performerService.findByIds(performerIds) : [],
            galleryIds.length ? this.galleryService.findByIds(galleryIds) : [],
            fileIds.length ? this.fileService.findByIds(fileIds) : []
        ]);
        const photos = data.map(photo => {
            const performer = photo.performerId &&
                performers.find(p => p._id.toString() === photo.performerId.toString());
            const gallery = photo.galleryId &&
                galleries.find(p => p._id.toString() === photo.galleryId.toString());
            const file = photo.fileId &&
                files.find(f => f._id.toString() === photo.fileId.toString());
            return Object.assign(Object.assign({}, photo), { gallery, performer: { username: performer.username }, photo: file && {
                    thumbnails: file.getThumbnails(),
                    url: jwToken
                        ? `${file.getUrl()}?galleryId=${photo.galleryId}&token=${jwToken}`
                        : `${file.getUrl()}?galleryId=${photo.galleryId}`,
                    width: file.width,
                    height: file.height,
                    mimeType: file.mimeType
                } });
        });
        return {
            data: photos.map(v => new dtos_2.PhotoDto(v)),
            total
        };
    }
};
PhotoSearchService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(providers_1.PERFORMER_PHOTO_MODEL_PROVIDER)),
    __param(3, common_1.Inject(common_1.forwardRef(() => services_2.FileService))),
    __param(4, common_1.Inject(common_1.forwardRef(() => services_3.PaymentTokenService))),
    __metadata("design:paramtypes", [mongoose_1.Model,
        services_1.PerformerService,
        gallery_service_1.GalleryService,
        services_2.FileService,
        services_3.PaymentTokenService])
], PhotoSearchService);
exports.PhotoSearchService = PhotoSearchService;
//# sourceMappingURL=photo-search.service.js.map