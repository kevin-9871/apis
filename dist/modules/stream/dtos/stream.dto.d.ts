import { ObjectId } from 'mongodb';
export declare type StreamType = 'public' | 'group' | 'private';
export interface IStream {
    _id?: ObjectId;
    performerId?: string | ObjectId;
    type?: string;
    userIds?: ObjectId[];
    sessionId?: string;
    isStreaming?: boolean;
    totalViewer?: number;
    streamingTime?: number;
    lastStreamingTime?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare class StreamDto {
    _id: ObjectId;
    performerId: string | ObjectId;
    userIds: ObjectId[];
    streamIds: string[];
    type: string;
    sessionId: string;
    isStreaming: boolean;
    totalViewer: number;
    streamingTime: number;
    lastStreamingTime: Date;
    createdAt: Date;
    updatedAt: Date;
    constructor(data: Partial<IStream>);
    toResponse(includePrivateInfo?: boolean): {
        _id: ObjectId;
        isStreaming: boolean;
        totalViewer: number;
        streamingTime: number;
        lastStreamingTime: Date;
    } | {
        performerId: string | ObjectId;
        userIds: ObjectId[];
        type: string;
        streamIds: string[];
        sessionId: string;
        createdAt: Date;
        updatedAt: Date;
        _id: ObjectId;
        isStreaming: boolean;
        totalViewer: number;
        streamingTime: number;
        lastStreamingTime: Date;
    };
}
