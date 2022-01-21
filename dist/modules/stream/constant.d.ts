export declare const PUBLIC_CHAT = "public";
export declare const PRIVATE_CHAT = "private";
export declare const GROUP_CHAT = "group";
export declare const MODEL_STREAM_CHANNEL = "MODEL_STREAM_CHANNEL";
export declare enum MODEL_STREAM_EVENT_NAME {
    GROUP_START = "GROUP_START",
    PRIVATE_ACCPET = "PRIVATE_ACCPET"
}
export declare const OFFLINE = "offline";
export declare const USER_LIVE_STREAM_CHANNEL = "USER_LIVE_STREAM_CHANNEL";
export declare const PERFORMER_LIVE_STREAM_CHANNEL = "PERFORMER_LIVE_STREAM_CHANNEL";
export declare enum LIVE_STREAM_EVENT_NAME {
    CONNECTED = "connected",
    DISCONNECTED = "disconnected"
}
export declare enum BroadcastStatus {
    FINISHED = "finished",
    BROADCASTING = "broadcasting",
    CREATED = "created"
}
export declare enum BroadcastType {
    LiveStream = "liveStream",
    IpCamera = "ipCamera",
    StreamSource = "streamSource",
    Vod = "Vod"
}
export declare const defaultStreamValue: {
    publish: boolean;
    publicStream: boolean;
    plannedStartDate: number;
    plannedEndDate: number;
    duration: number;
    mp4Enabled: number;
    webMEnabled: number;
    expireDurationMS: number;
    speed: number;
    pendingPacketSize: number;
    hlsViewerCount: number;
    webRTCViewerCount: number;
    rtmpViewerCount: number;
    startTime: number;
    receivedBytes: number;
    absoluteStartTimeMs: number;
    webRTCViewerLimit: number;
    hlsViewerLimit: number;
};
export interface TokenResponse {
    tokenId: string;
    streamId: string;
    expireDate: number;
    type: string;
    roomId: string;
}
