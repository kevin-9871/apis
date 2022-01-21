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
exports.VideoSearchService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const services_1 = require("../../performer/services");
const services_2 = require("../../file/services");
const dtos_1 = require("../../performer/dtos");
const services_3 = require("../../purchased-item/services");
const constants_1 = require("../../purchased-item/constants");
const dtos_2 = require("../../user/dtos");
const dtos_3 = require("../dtos");
const providers_1 = require("../providers");
const constants_2 = require("../constants");
let VideoSearchService = class VideoSearchService {
    constructor(videoModel, performerService, fileService, paymentTokenService) {
        this.videoModel = videoModel;
        this.performerService = performerService;
        this.fileService = fileService;
        this.paymentTokenService = paymentTokenService;
    }
    async adminSearch(req, jwToken) {
        const query = {};
        if (req.q)
            query.title = { $regex: req.q };
        if (req.performerId)
            query.performerId = req.performerId;
        if (req.status)
            query.status = req.status;
        let sort = { createdAt: -1 };
        if (req.sort && req.sortBy) {
            sort = {
                [req.sortBy]: req.sort
            };
        }
        const [data, total] = await Promise.all([
            this.videoModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(parseInt(req.limit, 10))
                .skip(parseInt(req.offset, 10)),
            this.videoModel.countDocuments(query)
        ]);
        const performerIds = data.map(d => d.performerId);
        const fileIds = [];
        data.forEach(v => {
            v.thumbnailId && fileIds.push(v.thumbnailId);
            v.fileId && fileIds.push(v.fileId);
        });
        const [performers, files] = await Promise.all([
            performerIds.length ? this.performerService.findByIds(performerIds) : [],
            fileIds.length ? this.fileService.findByIds(fileIds) : []
        ]);
        const videos = data.map(video => {
            const performer = performers.find(p => p._id.toString() === video.performerId.toString());
            const thumbnail = video.thumbnailId &&
                files.find(f => f._id.toString() === video.thumbnailId.toString());
            const file = video.fileId &&
                files.find(f => f._id.toString() === video.fileId.toString());
            return Object.assign(Object.assign({}, video), { performer: {
                    username: (performer === null || performer === void 0 ? void 0 : performer.username) || 'N/A'
                }, thumbnail: thumbnail === null || thumbnail === void 0 ? void 0 : thumbnail.getUrl(), video: file && {
                    url: jwToken
                        ? `${file.getUrl()}?videoId=${video._id}&token=${jwToken}`
                        : `${file.getUrl()}?videoId=${video._id}`,
                    thumbnails: file.getThumbnails(),
                    duration: file.duration
                } });
        });
        return {
            data: videos.map(v => new dtos_3.VideoDto(v)),
            total
        };
    }
    async performerSearch(req, performer, jwToken) {
        const query = {};
        if (req.q)
            query.title = { $regex: req.q };
        query.performerId = performer._id;
        if (req.status)
            query.status = req.status;
        let sort = { createdAt: -1 };
        if (req.sort && req.sortBy) {
            sort = {
                [req.sortBy]: req.sort
            };
        }
        const [data, total] = await Promise.all([
            this.videoModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(parseInt(req.limit, 10))
                .skip(parseInt(req.offset, 10)),
            this.videoModel.countDocuments(query)
        ]);
        const performerIds = data.map(d => d.performerId);
        const fileIds = [];
        data.forEach(v => {
            v.thumbnailId && fileIds.push(v.thumbnailId);
            v.fileId && fileIds.push(v.fileId);
            v.trailerId && fileIds.push(v.trailerId);
        });
        const [performers, files] = await Promise.all([
            performerIds.length ? this.performerService.findByIds(performerIds) : [],
            fileIds.length ? this.fileService.findByIds(fileIds) : []
        ]);
        const videos = data.map(video => {
            const model = performers.find(p => p._id.toString() === video.performerId.toString());
            const thumbnail = video.thumbnailId &&
                files.find(f => f._id.toString() === video.thumbnailId.toString());
            const file = video.fileId &&
                files.find(f => f._id.toString() === video.fileId.toString());
            const trailer = video.trailerId &&
                files.find(f => f._id.toString() === video.trailerId.toString());
            return Object.assign(Object.assign({}, video), { performer: {
                    username: (model === null || model === void 0 ? void 0 : model.username) || 'N/A'
                }, thumbnail: thumbnail === null || thumbnail === void 0 ? void 0 : thumbnail.getUrl(), video: file && {
                    url: jwToken
                        ? `${file.getUrl()}?videoId=${video._id}&token=${jwToken}`
                        : `${file.getUrl()}?videoId=${video._id}`,
                    thumbnails: file.getThumbnails(),
                    duration: file.duration
                }, trailer: trailer && {
                    url: trailer.getUrl(),
                    thumbnails: trailer.getThumbnails(),
                    duration: trailer.duration
                } });
        });
        return {
            data: videos.map(v => new dtos_3.VideoDto(v)),
            total
        };
    }
    async userSearch(req, user, jwToken) {
        const query = {};
        if (req.q)
            query.title = { $regex: req.q };
        if (req.performerId)
            query.performerId = req.performerId;
        if (req.isSaleVideo)
            query.isSaleVideo = req.isSaleVideo;
        query.status = constants_2.VIDEO_STATUS.ACTIVE;
        let sort = { createdAt: -1 };
        if (req.sort && req.sortBy) {
            sort = {
                [req.sortBy]: req.sort
            };
        }
        const [data, total] = await Promise.all([
            this.videoModel
                .find(query)
                .lean()
                .sort(sort)
                .limit(parseInt(req.limit, 10))
                .skip(parseInt(req.offset, 10)),
            this.videoModel.countDocuments(query)
        ]);
        const performerIds = data.map(d => d.performerId);
        const videoIds = data.map(d => d._id);
        const fileIds = [];
        data.forEach(v => {
            v.thumbnailId && fileIds.push(v.thumbnailId);
            v.fileId && fileIds.push(v.fileId);
        });
        const [performers, files, payments] = await Promise.all([
            performerIds.length ? this.performerService.findByIds(performerIds) : [],
            fileIds.length ? this.fileService.findByIds(fileIds) : [],
            user
                ? this.paymentTokenService.findByQuery({
                    targetId: { $in: videoIds },
                    sourceId: user._id,
                    status: constants_1.PURCHASE_ITEM_STATUS.SUCCESS
                })
                : []
        ]);
        const videos = data.map(v => {
            const video = new dtos_3.VideoDto(v);
            const purchasedVideo = payments.find(payment => payment.targetId.toString() === video._id.toString());
            const performer = performers.find(p => p._id.toString() === video.performerId.toString());
            const thumbnail = video.thumbnailId &&
                files.find(f => f._id.toString() === video.thumbnailId.toString());
            const file = video.fileId &&
                files.find(f => f._id.toString() === video.fileId.toString());
            return Object.assign(Object.assign({}, video), { isBought: !!purchasedVideo, performer: performer ? performer.toPublicDetailsResponse() : null, thumbnail: thumbnail === null || thumbnail === void 0 ? void 0 : thumbnail.getUrl(), video: file && {
                    url: jwToken
                        ? `${file.getUrl()}?videoId=${video._id}&token=${jwToken}`
                        : `${file.getUrl()}?videoId=${video._id}`,
                    thumbnails: file.getThumbnails(),
                    duration: file.duration
                } });
        });
        return {
            data: videos,
            total
        };
    }
};
VideoSearchService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(providers_1.PERFORMER_VIDEO_MODEL_PROVIDER)),
    __param(2, common_1.Inject(common_1.forwardRef(() => services_2.FileService))),
    __param(3, common_1.Inject(common_1.forwardRef(() => services_3.PaymentTokenService))),
    __metadata("design:paramtypes", [mongoose_1.Model,
        services_1.PerformerService,
        services_2.FileService,
        services_3.PaymentTokenService])
], VideoSearchService);
exports.VideoSearchService = VideoSearchService;
//# sourceMappingURL=video-search.service.js.map