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
exports.VideoService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const kernel_1 = require("../../../kernel");
const file_1 = require("../../file");
const dtos_1 = require("../../user/dtos");
const dtos_2 = require("../../performer/dtos");
const services_1 = require("../../file/services");
const services_2 = require("../../performer/services");
const lodash_1 = require("lodash");
const constants_1 = require("../../../kernel/constants");
const services_3 = require("../../auth/services");
const services_4 = require("../../purchased-item/services");
const dtos_3 = require("../dtos");
const constants_2 = require("../constants");
const providers_1 = require("../providers");
const FILE_PROCESSED_TOPIC = 'FILE_PROCESSED';
let VideoService = class VideoService {
    constructor(VideoModel, queueEventService, fileService, performerService, authService, paymentTokenService) {
        this.VideoModel = VideoModel;
        this.queueEventService = queueEventService;
        this.fileService = fileService;
        this.performerService = performerService;
        this.authService = authService;
        this.paymentTokenService = paymentTokenService;
        this.queueEventService.subscribe(constants_2.PERFORMER_VIDEO_CHANNEL, FILE_PROCESSED_TOPIC, this.handleFileProcessed.bind(this));
    }
    async findByIds(ids) {
        const videos = await this.VideoModel
            .find({
            _id: {
                $in: ids
            }
        })
            .lean()
            .exec();
        return videos.map((p) => new dtos_3.VideoDto(p));
    }
    async findById(id) {
        const video = await this.VideoModel
            .findOne({
            _id: id
        })
            .lean()
            .exec();
        return new dtos_3.VideoDto(video);
    }
    async handleFileProcessed(event) {
        try {
            const { eventName } = event;
            if (eventName !== services_1.FILE_EVENT.VIDEO_PROCSSED) {
                return;
            }
            const { videoId } = event.data.meta;
            const [video, file] = await Promise.all([
                this.VideoModel.findById(videoId),
                this.fileService.findById(event.data.fileId)
            ]);
            if (!video) {
                return;
            }
            const oldStatus = video.status;
            video.processing = false;
            if (file.status === 'error') {
                video.status = constants_2.VIDEO_STATUS.FILE_ERROR;
            }
            await video.save();
            await this.queueEventService.publish(new kernel_1.QueueEvent({
                channel: constants_2.PERFORMER_VIDEO_CHANNEL,
                eventName: constants_1.EVENT.UPDATED,
                data: Object.assign(Object.assign({}, new dtos_3.VideoDto(video)), { oldStatus })
            }));
        }
        catch (e) {
            console.log(e);
        }
    }
    getVideoForView(fileDto, videoId, jwToken) {
        return {
            url: jwToken ? `${fileDto.getUrl()}?videoId=${videoId}&token=${jwToken}` : `${fileDto.getUrl()}?videoId=${videoId}`,
            duration: fileDto.duration,
            thumbnails: (fileDto.thumbnails || []).map((thumb) => file_1.FileDto.getPublicUrl(thumb.path))
        };
    }
    async create(video, trailer, thumbnail, payload, creator) {
        let valid = true;
        if (!video)
            valid = false;
        if (!valid && thumbnail) {
            await this.fileService.remove(thumbnail._id);
        }
        if (thumbnail && !thumbnail.isImage()) {
            await this.fileService.remove(thumbnail._id);
        }
        if (video && !video.mimeType.toLowerCase().includes('video') && (video.name.split('.').pop() || '').toLocaleLowerCase() !== 'mkv') {
            await this.fileService.remove(video._id);
        }
        if (trailer && !trailer.mimeType.toLowerCase().includes('video') && (trailer.name.split('.').pop() || '').toLocaleLowerCase() !== 'mkv') {
            await this.fileService.remove(trailer._id);
        }
        if (!valid) {
            throw new Error('Invalid file format');
        }
        const model = new this.VideoModel(payload);
        model.fileId = video._id;
        model.thumbnailId = thumbnail ? thumbnail._id : null;
        model.trailerId = trailer ? trailer._id : null;
        model.processing = true;
        creator && model.set('createdBy', creator._id);
        model.createdAt = new Date();
        model.updatedAt = new Date();
        await model.save();
        model.thumbnailId
            && (await this.fileService.addRef(model.thumbnailId, {
                itemId: model._id,
                itemType: 'performer-video-thumbnail'
            }));
        model.fileId
            && (await this.fileService.addRef(model.fileId, {
                itemType: 'performer-video',
                itemId: model._id
            }));
        model.trailerId
            && (await this.fileService.addRef(model.trailerId, {
                itemType: 'performer-trailer-video',
                itemId: model._id
            }));
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: constants_2.PERFORMER_VIDEO_CHANNEL,
            eventName: constants_1.EVENT.CREATED,
            data: new dtos_3.VideoDto(model)
        }));
        await this.fileService.queueProcessVideo(model.fileId, {
            publishChannel: constants_2.PERFORMER_VIDEO_CHANNEL,
            meta: {
                videoId: model._id
            }
        });
        return new dtos_3.VideoDto(model);
    }
    async getDetails(videoId, jwToken) {
        const video = await this.VideoModel.findById(videoId);
        if (!video)
            throw new kernel_1.EntityNotFoundException();
        const [performer, videoFile, trailerFile, thumbnailFile] = await Promise.all([
            this.performerService.findById(video.performerId),
            this.fileService.findById(video.fileId),
            video.trailerId ? this.fileService.findById(video.trailerId) : null,
            video.thumbnailId ? this.fileService.findById(video.thumbnailId) : null
        ]);
        const dto = new dtos_3.VideoDto(video);
        dto.thumbnail = thumbnailFile ? thumbnailFile.getUrl() : null;
        dto.video = this.getVideoForView(videoFile, dto._id, jwToken);
        dto.trailer = trailerFile ? this.getVideoForView(trailerFile, null, null) : null;
        dto.performer = performer
            ? {
                username: performer.username
            }
            : null;
        return dto;
    }
    async userGetDetails(videoId, currentUser, jwToken) {
        const video = await this.VideoModel.findById(videoId);
        if (!video)
            throw new kernel_1.EntityNotFoundException();
        const [performer, videoFile, thumbnailFile, trailerFile] = await Promise.all([
            this.performerService.findById(video.performerId),
            this.fileService.findById(video.fileId),
            video.thumbnailId ? this.fileService.findById(video.thumbnailId) : null,
            video.trailerId ? this.fileService.findById(video.trailerId) : null
        ]);
        const dto = new dtos_3.VideoDto(video);
        dto.thumbnail = thumbnailFile ? thumbnailFile.getUrl() : null;
        dto.trailer = trailerFile ? this.getVideoForView(trailerFile, null, null) : null;
        if (!dto.isSaleVideo) {
            dto.video = this.getVideoForView(videoFile, dto._id, jwToken);
        }
        else {
            const isBought = await this.paymentTokenService.checkBoughtVideo(dto._id, currentUser);
            dto.video = this.getVideoForView(videoFile, dto._id, jwToken);
            dto.isBought = isBought;
        }
        dto.performer = performer ? performer.toPublicDetailsResponse() : null;
        return dto;
    }
    async increaseView(id) {
        return this.VideoModel.updateOne({ _id: id }, {
            $inc: { 'stats.views': 1 }
        }, { new: true });
    }
    async updateInfo(id, payload, file, trailer, thumbnail, updater) {
        const video = await this.VideoModel.findById(id);
        if (!video) {
            throw new kernel_1.EntityNotFoundException();
        }
        const oldStatus = video.status;
        lodash_1.merge(video, payload);
        if (video.status !== constants_2.VIDEO_STATUS.FILE_ERROR && payload.status !== constants_2.VIDEO_STATUS.FILE_ERROR) {
            video.status = payload.status;
        }
        const deletedFileIds = [];
        if (file) {
            video.fileId && deletedFileIds.push(video.fileId);
            video.fileId = file._id;
        }
        if (trailer) {
            video.trailerId && deletedFileIds.push(video.trailerId);
            video.trailerId = trailer._id;
        }
        if (thumbnail) {
            video.thumbnailId && deletedFileIds.push(video.thumbnailId);
            video.thumbnailId = thumbnail._id;
        }
        updater && video.set('updatedBy', updater._id);
        video.updatedAt = new Date();
        await video.save();
        deletedFileIds.length && (await Promise.all(deletedFileIds.map((deletedFileId) => this.fileService.remove(deletedFileId))));
        const dto = new dtos_3.VideoDto(video);
        await this.queueEventService.publish(new kernel_1.QueueEvent({
            channel: constants_2.PERFORMER_VIDEO_CHANNEL,
            eventName: constants_1.EVENT.UPDATED,
            data: Object.assign(Object.assign({}, dto), { oldStatus })
        }));
        return dto;
    }
    async delete(id) {
        const video = await this.VideoModel.findById(id);
        if (!video) {
            throw new kernel_1.EntityNotFoundException();
        }
        await video.remove();
        await Promise.all([
            this.queueEventService.publish(new kernel_1.QueueEvent({
                channel: constants_2.PERFORMER_VIDEO_CHANNEL,
                eventName: constants_1.EVENT.DELETED,
                data: new dtos_3.VideoDto(video)
            })),
            this.queueEventService.publish({
                channel: services_1.MEDIA_FILE_CHANNEL,
                eventName: services_1.FILE_EVENT.ASSETS_ITEM_DELETED,
                data: {
                    type: 'video',
                    metadata: video.toObject()
                }
            })
        ]);
        return true;
    }
    async checkAuth(req) {
        const { query: { videoId, token } } = req;
        if (!videoId) {
            return false;
        }
        const video = await this.VideoModel.findById(videoId);
        if (!video) {
            return false;
        }
        if (!video.isSaleVideo) {
            return true;
        }
        if (!token) {
            return false;
        }
        const user = await this.authService.getSourceFromJWT(token);
        if (user.roles && user.roles.includes('admin')) {
            return true;
        }
        if (user._id.toString() === video.performerId.toString()) {
            return true;
        }
        const checkBought = await this.paymentTokenService.checkBoughtVideo(video._id, user);
        if (checkBought) {
            return true;
        }
        return false;
    }
};
VideoService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(providers_1.PERFORMER_VIDEO_MODEL_PROVIDER)),
    __param(2, common_1.Inject(common_1.forwardRef(() => services_1.FileService))),
    __param(4, common_1.Inject(common_1.forwardRef(() => services_3.AuthService))),
    __param(5, common_1.Inject(common_1.forwardRef(() => services_4.PaymentTokenService))),
    __metadata("design:paramtypes", [mongoose_1.Model,
        kernel_1.QueueEventService,
        services_1.FileService,
        services_2.PerformerService,
        services_3.AuthService,
        services_4.PaymentTokenService])
], VideoService);
exports.VideoService = VideoService;
//# sourceMappingURL=video.service.js.map