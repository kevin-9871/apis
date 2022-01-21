"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultStreamValue = exports.BroadcastType = exports.BroadcastStatus = exports.LIVE_STREAM_EVENT_NAME = exports.PERFORMER_LIVE_STREAM_CHANNEL = exports.USER_LIVE_STREAM_CHANNEL = exports.OFFLINE = exports.MODEL_STREAM_EVENT_NAME = exports.MODEL_STREAM_CHANNEL = exports.GROUP_CHAT = exports.PRIVATE_CHAT = exports.PUBLIC_CHAT = void 0;
exports.PUBLIC_CHAT = 'public';
exports.PRIVATE_CHAT = 'private';
exports.GROUP_CHAT = 'group';
exports.MODEL_STREAM_CHANNEL = 'MODEL_STREAM_CHANNEL';
var MODEL_STREAM_EVENT_NAME;
(function (MODEL_STREAM_EVENT_NAME) {
    MODEL_STREAM_EVENT_NAME["GROUP_START"] = "GROUP_START";
    MODEL_STREAM_EVENT_NAME["PRIVATE_ACCPET"] = "PRIVATE_ACCPET";
})(MODEL_STREAM_EVENT_NAME = exports.MODEL_STREAM_EVENT_NAME || (exports.MODEL_STREAM_EVENT_NAME = {}));
exports.OFFLINE = 'offline';
exports.USER_LIVE_STREAM_CHANNEL = 'USER_LIVE_STREAM_CHANNEL';
exports.PERFORMER_LIVE_STREAM_CHANNEL = 'PERFORMER_LIVE_STREAM_CHANNEL';
var LIVE_STREAM_EVENT_NAME;
(function (LIVE_STREAM_EVENT_NAME) {
    LIVE_STREAM_EVENT_NAME["CONNECTED"] = "connected";
    LIVE_STREAM_EVENT_NAME["DISCONNECTED"] = "disconnected";
})(LIVE_STREAM_EVENT_NAME = exports.LIVE_STREAM_EVENT_NAME || (exports.LIVE_STREAM_EVENT_NAME = {}));
var BroadcastStatus;
(function (BroadcastStatus) {
    BroadcastStatus["FINISHED"] = "finished";
    BroadcastStatus["BROADCASTING"] = "broadcasting";
    BroadcastStatus["CREATED"] = "created";
})(BroadcastStatus = exports.BroadcastStatus || (exports.BroadcastStatus = {}));
var BroadcastType;
(function (BroadcastType) {
    BroadcastType["LiveStream"] = "liveStream";
    BroadcastType["IpCamera"] = "ipCamera";
    BroadcastType["StreamSource"] = "streamSource";
    BroadcastType["Vod"] = "Vod";
})(BroadcastType = exports.BroadcastType || (exports.BroadcastType = {}));
exports.defaultStreamValue = {
    publish: true,
    publicStream: true,
    plannedStartDate: 0,
    plannedEndDate: 0,
    duration: 0,
    mp4Enabled: 0,
    webMEnabled: 0,
    expireDurationMS: 0,
    speed: 0,
    pendingPacketSize: 0,
    hlsViewerCount: 0,
    webRTCViewerCount: 0,
    rtmpViewerCount: 0,
    startTime: 0,
    receivedBytes: 0,
    absoluteStartTimeMs: 0,
    webRTCViewerLimit: -1,
    hlsViewerLimit: -1
};
//# sourceMappingURL=constant.js.map