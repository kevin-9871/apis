"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamDto = void 0;
const _ = require("lodash");
class StreamDto {
    constructor(data) {
        Object.assign(this, _.pick(data, [
            '_id',
            'performerId',
            'userIds',
            'type',
            'streamIds',
            'sessionId',
            'isStreaming',
            'totalViewer',
            'streamingTime',
            'lastStreamingTime',
            'createdAt',
            'updatedAt'
        ]));
    }
    toResponse(includePrivateInfo = false) {
        const publicInfo = {
            _id: this._id,
            isStreaming: this.isStreaming,
            totalViewer: this.totalViewer,
            streamingTime: this.streamingTime,
            lastStreamingTime: this.lastStreamingTime
        };
        if (!includePrivateInfo) {
            return publicInfo;
        }
        return Object.assign(Object.assign({}, publicInfo), { performerId: this.performerId, userIds: this.userIds, type: this.type, streamIds: this.streamIds, sessionId: this.sessionId, createdAt: this.createdAt, updatedAt: this.updatedAt });
    }
}
exports.StreamDto = StreamDto;
//# sourceMappingURL=stream.dto.js.map