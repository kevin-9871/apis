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
exports.PurchasedItemSearchService = void 0;
const common_1 = require("@nestjs/common");
const services_1 = require("../../user/services");
const services_2 = require("../../performer/services");
const dtos_1 = require("../../user/dtos");
const services_3 = require("../../file/services");
const mongoose_1 = require("mongoose");
const moment = require("moment");
const providers_1 = require("../../performer-assets/providers");
const models_1 = require("../../performer-assets/models");
const dtos_2 = require("../../performer-assets/dtos");
const file_1 = require("../../file");
const services_4 = require("../../performer-assets/services");
const providers_2 = require("../providers");
const dtos_3 = require("../dtos");
const constants_1 = require("../constants");
let PurchasedItemSearchService = class PurchasedItemSearchService {
    constructor(fileService, performerService, PaymentTokenModel, userService, videoModel, PhotoModel, galleryService) {
        this.fileService = fileService;
        this.performerService = performerService;
        this.PaymentTokenModel = PaymentTokenModel;
        this.userService = userService;
        this.videoModel = videoModel;
        this.PhotoModel = PhotoModel;
        this.galleryService = galleryService;
    }
    async getUserTransactionsToken(req, user) {
        const query = {
            source: 'user',
            sourceId: user._id
        };
        if (req.type)
            query.type = req.type;
        if (req.status)
            query.status = req.status;
        if (req.sellerId)
            query.sellerId = req.sellerId;
        if (req.performerId)
            query.sellerId = req.sellerId;
        if (req.fromDate && req.toDate) {
            query.createdAt = {
                $gt: moment(req.fromDate).startOf('day'),
                $lt: moment(req.toDate).endOf('day')
            };
        }
        const sort = {
            [req.sortBy || 'updatedAt']: req.sort || -1
        };
        const [data, total] = await Promise.all([
            this.PaymentTokenModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(parseInt(req.limit, 10))
                .skip(parseInt(req.offset, 10)),
            this.PaymentTokenModel.countDocuments(query)
        ]);
        const performerIds = data.filter(d => d.sellerId).map(d => d.sellerId);
        const performers = performerIds.length ?
            await this.performerService.findByIds(performerIds) :
            [];
        const dtos = data.map(d => new dtos_3.PurchasedItemDto(d));
        dtos.forEach(dto => {
            if (dto.sellerId) {
                const performer = performers.find(p => p._id.toString() === dto.sellerId.toString());
                dto.sellerInfo = performer === null || performer === void 0 ? void 0 : performer.toPublicDetailsResponse();
            }
        });
        await this._mapVideoInfo(dtos);
        await this._mapGalleryInfo(dtos);
        return {
            total,
            data: dtos
        };
    }
    async adminGetUserTransactionsToken(req) {
        const query = {};
        if (req.sourceId)
            query.sourceId = req.sourceId;
        if (req.source)
            query.source = req.source;
        if (req.type)
            query.type = req.type;
        if (req.status)
            query.status = req.status;
        if (req.target)
            query.target = req.target;
        if (req.targetId)
            query.targetId = req.targetId;
        if (req.sellerId)
            query.sellerId = req.sellerId;
        if (req.performerId)
            query.sellerId = req.sellerId;
        if (req.fromDate && req.toDate) {
            query.createdAt = {
                $gt: moment(req.fromDate).startOf('day'),
                $lt: moment(req.toDate).endOf('day')
            };
        }
        const sort = {
            [req.sortBy || 'updatedAt']: req.sort || -1
        };
        const [data, total] = await Promise.all([
            this.PaymentTokenModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(parseInt(req.limit, 10))
                .skip(parseInt(req.offset, 10)),
            this.PaymentTokenModel.countDocuments(query)
        ]);
        const sourceIds = data.filter(d => d.source === 'user').map(d => d.sourceId);
        const sellerIds = data.map(d => d.sellerId);
        const [users, performers] = await Promise.all([
            sourceIds.length ? this.userService.findByIds(sourceIds) : [],
            sellerIds ? this.performerService.findByIds(sellerIds) : []
        ]);
        const dtos = data.map(d => new dtos_3.PurchasedItemDto(d));
        dtos.forEach(dto => {
            const performer = performers.find(p => p._id.toString() === dto.sellerId.toString());
            dto.sellerInfo = performer === null || performer === void 0 ? void 0 : performer.toResponse();
            const user = users.find(u => u._id.toString() === dto.sourceId.toString());
            dto.sourceInfo = user === null || user === void 0 ? void 0 : user.toResponse();
        });
        return {
            total,
            data: dtos
        };
    }
    async userSearchPurchasedItem(query, sort, req) {
        const [data, total] = await Promise.all([
            this.PaymentTokenModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(parseInt(req.limit, 10))
                .skip(parseInt(req.offset, 10)),
            this.PaymentTokenModel.countDocuments(query)
        ]);
        return {
            total,
            data: data.map(d => new dtos_3.PurchasedItemDto(d))
        };
    }
    async _mapVideoInfo(purchasedItems) {
        const videoIds = purchasedItems.filter(p => p.type === constants_1.PURCHASE_ITEM_TYPE.SALE_VIDEO).map(p => p.targetId);
        if (!videoIds)
            return;
        const videoModels = await this.videoModel.find({ _id: { $in: videoIds } });
        if (!videoModels.length)
            return;
        const videos = videoModels.map(v => new dtos_2.VideoDto(v));
        const videoFiles = await Promise.all(videoModels
            .filter(v => v.fileId)
            .map(v => this.fileService.findById(v.fileId)));
        videos.forEach(v => {
            if (v.fileId) {
                const videoFile = videoFiles.find(f => f._id.toString() === v.fileId.toString());
                if (videoFile) {
                    v.video = {
                        duration: videoFile.duration,
                        thumbnails: (videoFile.thumbnails || [])
                            .map((thumb) => file_1.FileDto.getPublicUrl(thumb.path))
                    };
                }
            }
        });
        purchasedItems.forEach(p => {
            const video = videos.find(v => p.targetId.toString() === v._id.toString());
            if (video)
                p.targetInfo = video;
        });
    }
    async _mapGalleryInfo(purchasedItems) {
        const galleryIds = purchasedItems.filter(p => p.type === constants_1.PURCHASE_ITEM_TYPE.PHOTO).map(p => p.targetId);
        if (!galleryIds)
            return;
        const galleries = await this.galleryService.findByIds(galleryIds);
        if (!galleries.length)
            return;
        const coverPhotoIds = galleries.filter(g => g.coverPhotoId).map(g => g.coverPhotoId);
        const coverFiles = coverPhotoIds.length ?
            await this.PhotoModel.find({ _id: { $in: coverPhotoIds } }) :
            [];
        if (coverFiles.length) {
            const fileIds = coverFiles.map(c => c.fileId);
            const files = await this.fileService.findByIds(fileIds);
            galleries.forEach(g => {
                if (g.coverPhotoId) {
                    const coverPhoto = coverFiles.find(c => c._id.toString() === g.coverPhotoId.toString());
                    if (coverPhoto) {
                        const file = files.find(f => f._id.toString() === coverPhoto.fileId.toString());
                        if (file) {
                            g.coverPhoto = {
                                thumbnails: file.getThumbnails()
                            };
                        }
                    }
                }
            });
        }
        purchasedItems.forEach(p => {
            const gallery = galleries.find(g => p.targetId.toString() === g._id.toString());
            if (gallery) {
                p.targetInfo = gallery;
            }
        });
    }
};
PurchasedItemSearchService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(common_1.forwardRef(() => services_3.FileService))),
    __param(1, common_1.Inject(common_1.forwardRef(() => services_2.PerformerService))),
    __param(2, common_1.Inject(providers_2.PURCHASE_ITEM_MODEL_PROVIDER)),
    __param(3, common_1.Inject(common_1.forwardRef(() => services_1.UserService))),
    __param(4, common_1.Inject(providers_1.PERFORMER_VIDEO_MODEL_PROVIDER)),
    __param(5, common_1.Inject(providers_1.PERFORMER_PHOTO_MODEL_PROVIDER)),
    __param(6, common_1.Inject(common_1.forwardRef(() => services_4.GalleryService))),
    __metadata("design:paramtypes", [services_3.FileService,
        services_2.PerformerService,
        mongoose_1.Model,
        services_1.UserService,
        mongoose_1.Model,
        mongoose_1.Model,
        services_4.GalleryService])
], PurchasedItemSearchService);
exports.PurchasedItemSearchService = PurchasedItemSearchService;
//# sourceMappingURL=purchase-item-search.service.js.map