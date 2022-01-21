import { ObjectId } from 'mongodb';
import { VideoModel } from '../models';
export declare class VideoDto {
    _id?: ObjectId;
    performerId?: ObjectId;
    fileId?: ObjectId;
    type?: string;
    title?: string;
    description?: string;
    status?: string;
    processing?: boolean;
    thumbnailId?: ObjectId;
    token?: number;
    isBought?: boolean;
    thumbnail?: string;
    video?: any;
    trailer?: any;
    trailerId?: ObjectId;
    isSaleVideo?: boolean;
    performer?: any;
    createdBy?: ObjectId;
    updatedBy?: ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
    constructor(init?: Partial<VideoDto>);
    static fromModel(file: VideoModel): VideoDto;
}
export declare class IVideoResponse {
    _id?: ObjectId;
    performerId?: ObjectId;
    fileId?: ObjectId;
    type?: string;
    title?: string;
    description?: string;
    status?: string;
    tags?: string[];
    processing?: boolean;
    thumbnailId?: ObjectId;
    isSaleVideo?: boolean;
    price?: number;
    thumbnail?: string;
    video?: any;
    token?: number;
    performer?: any;
    stats?: {
        views: number;
        likes: number;
        comments: number;
    };
    userReaction?: {
        liked?: boolean;
        favourited?: boolean;
        watchedLater?: boolean;
    };
    isBought?: boolean;
    isSubscribed?: boolean;
    createdBy?: ObjectId;
    updatedBy?: ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
    constructor(init?: Partial<IVideoResponse>);
    static fromModel(file: VideoModel): VideoDto;
}
