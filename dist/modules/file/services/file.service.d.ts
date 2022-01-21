/// <reference types="node" />
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { ConfigService } from 'nestjs-config';
import { QueueEventService, QueueEvent } from 'src/kernel';
import { FileModel } from '../models';
import { IMulterUploadedFile } from '../lib/multer/multer.utils';
import { FileDto } from '../dtos';
import { IFileUploadOptions } from '../lib';
import { ImageService } from './image.service';
import { VideoService } from './video.service';
export declare const MEDIA_FILE_CHANNEL = "MEDIA_FILE_CHANNEL";
export declare const FILE_EVENT: {
    VIDEO_PROCSSED: string;
    PHOTO_PROCESSED: string;
    FILE_RELATED_MODULE_UPDATED: string;
    ASSETS_ITEM_DELETED: string;
};
export declare const DELETE_FILE_TYPE: {
    FILEID: string;
    FILE_PATH: string;
};
export declare class FileService {
    private readonly config;
    private readonly fileModel;
    private readonly imageService;
    private readonly videoService;
    private readonly queueEventService;
    private readonly logger;
    constructor(config: ConfigService, fileModel: Model<FileModel>, imageService: ImageService, videoService: VideoService, queueEventService: QueueEventService);
    findById(id: string | ObjectId): Promise<FileDto>;
    findByIds(ids: string[] | ObjectId[]): Promise<FileDto[]>;
    createFromMulter(type: string, multerData: IMulterUploadedFile, fileUploadOptions?: IFileUploadOptions): Promise<FileDto>;
    addRef(fileId: string | ObjectId, ref: {
        itemId: ObjectId;
        itemType: string;
    }): Promise<{
        ok: number;
        n: number;
        nModified: number;
    }>;
    remove(fileId: string | ObjectId): Promise<boolean>;
    removeIfNotHaveRef(fileId: string | ObjectId): Promise<boolean>;
    private _processVideo;
    queueProcessVideo(fileId: string | ObjectId, options?: {
        meta: Record<string, any>;
        publishChannel: string;
    }): Promise<boolean>;
    queueProcessPhoto(fileId: string | ObjectId, options?: {
        meta: Record<string, any>;
        publishChannel: string;
        thumbnailSize: {
            width: number;
            height: number;
        };
    }): Promise<boolean>;
    private _processPhoto;
    private generateJwt;
    generateDownloadLink(fileId: string | ObjectId): Promise<string>;
    getStreamToDownload(key: string): Promise<{
        file: FileModel;
        stream: import("fs").ReadStream;
    }>;
    deleteMediaFileIfUpdated(event: QueueEvent): Promise<void>;
    deleteMediaFileIfAssetsDeleted(event: QueueEvent): Promise<void>;
}
