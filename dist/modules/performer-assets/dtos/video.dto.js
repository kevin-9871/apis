"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IVideoResponse = exports.VideoDto = void 0;
const lodash_1 = require("lodash");
class VideoDto {
    constructor(init) {
        Object.assign(this, lodash_1.pick(init, [
            '_id',
            'performerId',
            'fileId',
            'type',
            'title',
            'description',
            'status',
            'processing',
            'thumbnailId',
            'token',
            'video',
            'thumbnail',
            'isSaleVideo',
            'trailer',
            'trailerId',
            'performer',
            'createdBy',
            'updatedBy',
            'createdAt',
            'updatedAt',
            'isBought'
        ]));
    }
    static fromModel(file) {
        return new VideoDto(file);
    }
}
exports.VideoDto = VideoDto;
class IVideoResponse {
    constructor(init) {
        Object.assign(this, lodash_1.pick(init, [
            '_id',
            'performerId',
            'fileId',
            'type',
            'title',
            'token',
            'description',
            'status',
            'processing',
            'thumbnailId',
            'isSchedule',
            'isSaleVideo',
            'price',
            'video',
            'thumbnail',
            'performer',
            'tags',
            'stats',
            'userReaction',
            'isBought',
            'isSubscribed',
            'createdBy',
            'updatedBy',
            'scheduledAt',
            'createdAt',
            'updatedAt'
        ]));
    }
    static fromModel(file) {
        return new VideoDto(file);
    }
}
exports.IVideoResponse = IVideoResponse;
//# sourceMappingURL=video.dto.js.map