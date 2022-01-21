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
exports.GalleryService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const services_1 = require("../../performer/services");
const dtos_1 = require("../../user/dtos");
const mongodb_1 = require("mongodb");
const lodash_1 = require("lodash");
const services_2 = require("../../file/services");
const services_3 = require("../../purchased-item/services");
const constants_1 = require("../../purchased-item/constants");
const constants_2 = require("../../../kernel/constants");
const dtos_2 = require("../dtos");
const providers_1 = require("../providers");
const constants_3 = require("../constants");
let GalleryService = class GalleryService {
    constructor(performerService, paymentTokenService, galleryModel, photoModel, fileService, queueEventServce) {
        this.performerService = performerService;
        this.paymentTokenService = paymentTokenService;
        this.galleryModel = galleryModel;
        this.photoModel = photoModel;
        this.fileService = fileService;
        this.queueEventServce = queueEventServce;
    }
    async create(payload, creator) {
        if (payload.performerId) {
            const performer = await this.performerService.findById(payload.performerId);
            if (!performer) {
                throw new kernel_1.EntityNotFoundException('Performer not found!');
            }
        }
        const model = new this.galleryModel(payload);
        if (creator) {
            if (!model.performerId) {
                model.performerId = creator._id;
            }
            model.createdBy = creator._id;
            model.updatedBy = creator._id;
        }
        await model.save();
        return dtos_2.GalleryDto.fromModel(model);
    }
    async update(id, payload, creator) {
        const gallery = await this.galleryModel.findById(id);
        if (!gallery) {
            throw new kernel_1.EntityNotFoundException('Gallery not found!');
        }
        lodash_1.merge(gallery, payload);
        gallery.updatedAt = new Date();
        if (creator) {
            gallery.updatedBy = creator._id;
        }
        await gallery.save();
        return dtos_2.GalleryDto.fromModel(gallery);
    }
    async findByIds(ids) {
        const galleries = await this.galleryModel
            .find({
            _id: {
                $in: ids
            }
        })
            .lean()
            .exec();
        return galleries.map(g => new dtos_2.GalleryDto(g));
    }
    async findById(id) {
        const gallery = await this.galleryModel.findOne({ _id: id });
        if (!gallery) {
            throw new kernel_1.EntityNotFoundException();
        }
        return new dtos_2.GalleryDto(gallery);
    }
    async details(id, user) {
        const gallery = await this.galleryModel.findOne({ _id: id });
        if (!gallery) {
            throw new kernel_1.EntityNotFoundException();
        }
        const dto = new dtos_2.GalleryDto(gallery);
        if (gallery.performerId) {
            const performer = await this.performerService.findById(gallery.performerId);
            if (performer) {
                dto.performer = {
                    username: performer.username
                };
            }
        }
        dto.isBought = user
            ? await this.paymentTokenService.checkBought(gallery._id, constants_1.PurchaseItemType.PHOTO, user)
            : false;
        return dto;
    }
    async adminSearch(req, jwToken) {
        const query = {};
        if (req.q)
            query.name = { $regex: req.q };
        if (req.performerId)
            query.performerId = req.performerId;
        if (req.status)
            query.status = req.status;
        let sort = {};
        if (req.sort && req.sortBy) {
            sort = {
                [req.sortBy]: req.sort
            };
        }
        const [data, total] = await Promise.all([
            this.galleryModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(parseInt(req.limit, 10))
                .skip(parseInt(req.offset, 10)),
            this.galleryModel.countDocuments(query)
        ]);
        const performerIds = data.map(d => d.performerId);
        const coverPhotoIds = data.map(d => d.coverPhotoId);
        const [performers, coverPhotos] = await Promise.all([
            performerIds.length ? this.performerService.findByIds(performerIds) : [],
            coverPhotoIds.length
                ? this.photoModel
                    .find({ _id: { $in: coverPhotoIds } })
                    .lean()
                    .exec()
                : []
        ]);
        const fileIds = coverPhotos.map(c => c.fileId);
        const files = await this.fileService.findByIds(fileIds);
        const galleries = data.map(g => {
            const performer = g.performerId &&
                performers.find(p => p._id.toString() === g.performerId.toString());
            const coverPhoto = g.coverPhotoId &&
                coverPhotos.find(c => c._id.toString() === g.coverPhotoId.toString());
            const file = coverPhoto &&
                files.find(f => f._id.toString() === coverPhoto.fileId.toString());
            return Object.assign(Object.assign({}, g), { performer: performer && { username: performer.username }, coverPhoto: file && {
                    url: jwToken ? `${file.getUrl()}?galleryId=${g._id}&token=${jwToken}` : `${file.getUrl()}?galleryId=${g._id}`,
                    thumbnails: file.getThumbnails()
                } });
        });
        return {
            data: galleries.map(g => new dtos_2.GalleryDto(g)),
            total
        };
    }
    async performerSearch(req, user, jwToken) {
        const query = {};
        if (req.q)
            query.name = { $regex: req.q };
        query.performerId = user._id;
        if (req.status)
            query.status = req.status;
        let sort = {};
        if (req.sort && req.sortBy) {
            sort = {
                [req.sortBy]: req.sort
            };
        }
        const [data, total] = await Promise.all([
            this.galleryModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(parseInt(req.limit, 10))
                .skip(parseInt(req.offset, 10)),
            this.galleryModel.countDocuments(query)
        ]);
        const performerIds = data.map(d => d.performerId);
        const coverPhotoIds = data.map(d => d.coverPhotoId);
        const [performers, coverPhotos] = await Promise.all([
            performerIds.length ? this.performerService.findByIds(performerIds) : [],
            coverPhotoIds.length
                ? this.photoModel
                    .find({ _id: { $in: coverPhotoIds } })
                    .lean()
                    .exec()
                : []
        ]);
        const fileIds = coverPhotos.map(c => c.fileId);
        const files = await this.fileService.findByIds(fileIds);
        const galleries = data.map(g => {
            const performer = g.performerId &&
                performers.find(p => p._id.toString() === g.performerId.toString());
            const coverPhoto = g.coverPhotoId &&
                coverPhotos.find(c => c._id.toString() === g.coverPhotoId.toString());
            const file = coverPhoto &&
                files.find(f => f._id.toString() === coverPhoto.fileId.toString());
            return Object.assign(Object.assign({}, g), { performer: performer && { username: performer.username }, coverPhoto: file && {
                    url: jwToken ? `${file.getUrl()}?galleryId=${g._id}&token=${jwToken}` : `${file.getUrl()}?galleryId=${g._id}`,
                    thumbnails: file.getThumbnails()
                } });
        });
        return {
            data: galleries.map(g => new dtos_2.GalleryDto(g)),
            total
        };
    }
    async userSearch(req, user, jwToken) {
        const query = {};
        if (req.q)
            query.name = { $regex: req.q };
        if (req.performerId)
            query.performerId = req.performerId;
        query.status = 'active';
        query.numOfItems = { $gt: 0 };
        let sort = {};
        if (req.sort && req.sortBy) {
            sort = {
                [req.sortBy]: req.sort
            };
        }
        const [data, total] = await Promise.all([
            this.galleryModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(parseInt(req.limit, 10))
                .skip(parseInt(req.offset, 10)),
            this.galleryModel.countDocuments(query)
        ]);
        const performerIds = data.map(d => d.performerId);
        const coverPhotoIds = data.map(d => d.coverPhotoId);
        const galleryIds = data.map(d => d._id);
        const [performers, coverPhotos, payments] = await Promise.all([
            performerIds.length ? this.performerService.findByIds(performerIds) : [],
            coverPhotoIds.length
                ? this.photoModel
                    .find({ _id: { $in: coverPhotoIds } })
                    .lean()
                    .exec()
                : [],
            user ? this.paymentTokenService.findByQuery({
                sourceId: user._id,
                targetId: { $in: galleryIds },
                status: constants_1.PURCHASE_ITEM_STATUS.SUCCESS
            }) : []
        ]);
        const fileIds = coverPhotos.map(c => c.fileId);
        const files = await this.fileService.findByIds(fileIds);
        const galleries = data.map(g => {
            const purchased = user && payments.find(p => p.targetId.toString() === g._id.toString());
            const performer = g.performerId &&
                performers.find(p => p._id.toString() === g.performerId.toString());
            const coverPhoto = g.coverPhotoId &&
                coverPhotos.find(c => c._id.toString() === g.coverPhotoId.toString());
            const file = coverPhoto &&
                files.find(f => f._id.toString() === coverPhoto.fileId.toString());
            return Object.assign(Object.assign({}, g), { performer: { username: (performer === null || performer === void 0 ? void 0 : performer.username) || 'N/A' }, coverPhoto: file && {
                    url: jwToken ? `${file.getUrl()}?galleryId=${g._id}&token=${jwToken}` : `${file.getUrl()}?galleryId=${g._id}`,
                    thumbnails: file.getThumbnails()
                }, isBought: !!purchased });
        });
        return {
            data: galleries.map(g => new dtos_2.GalleryDto(g)),
            total
        };
    }
    async updateCover(galleryId, photoId) {
        await this.galleryModel.updateOne({ _id: galleryId }, {
            coverPhotoId: new mongodb_1.ObjectId(photoId)
        });
        return true;
    }
    async delete(galleryId) {
        const gallery = await this.galleryModel.findById(galleryId);
        if (!gallery) {
            throw new kernel_1.EntityNotFoundException();
        }
        await gallery.remove();
        this.queueEventServce.publish(new kernel_1.QueueEvent({
            channel: constants_3.PERFORMER_GALLERY_CHANNEL,
            eventName: constants_2.EVENT.DELETED,
            data: { galleryId }
        }));
        return true;
    }
};
GalleryService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(common_1.forwardRef(() => services_1.PerformerService))),
    __param(1, common_1.Inject(common_1.forwardRef(() => services_3.PaymentTokenService))),
    __param(2, common_1.Inject(providers_1.PERFORMER_GALLERY_MODEL_PROVIDER)),
    __param(3, common_1.Inject(providers_1.PERFORMER_PHOTO_MODEL_PROVIDER)),
    __param(4, common_1.Inject(common_1.forwardRef(() => services_2.FileService))),
    __metadata("design:paramtypes", [services_1.PerformerService,
        services_3.PaymentTokenService,
        mongoose_1.Model,
        mongoose_1.Model,
        services_2.FileService,
        kernel_1.QueueEventService])
], GalleryService);
exports.GalleryService = GalleryService;
//# sourceMappingURL=gallery.service.js.map