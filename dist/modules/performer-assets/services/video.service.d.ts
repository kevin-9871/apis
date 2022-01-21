import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { QueueEventService, QueueEvent } from 'src/kernel';
import { FileDto } from 'src/modules/file';
import { UserDto } from 'src/modules/user/dtos';
import { PerformerDto } from 'src/modules/performer/dtos';
import { FileService } from 'src/modules/file/services';
import { PerformerService } from 'src/modules/performer/services';
import { AuthService } from 'src/modules/auth/services';
import { Request } from 'express';
import { PaymentTokenService } from 'src/modules/purchased-item/services';
import { VideoUpdatePayload } from '../payloads';
import { VideoDto } from '../dtos';
import { VideoCreatePayload } from '../payloads/video-create.payload';
import { VideoModel } from '../models';
export declare class VideoService {
    private readonly VideoModel;
    private readonly queueEventService;
    private readonly fileService;
    private readonly performerService;
    private readonly authService;
    private readonly paymentTokenService;
    constructor(VideoModel: Model<VideoModel>, queueEventService: QueueEventService, fileService: FileService, performerService: PerformerService, authService: AuthService, paymentTokenService: PaymentTokenService);
    findByIds(ids: string[] | ObjectId[]): Promise<VideoDto[]>;
    findById(id: string | ObjectId): Promise<VideoDto>;
    handleFileProcessed(event: QueueEvent): Promise<void>;
    private getVideoForView;
    create(video: FileDto, trailer: FileDto, thumbnail: FileDto, payload: VideoCreatePayload, creator?: PerformerDto): Promise<VideoDto>;
    getDetails(videoId: string | ObjectId, jwToken: string): Promise<VideoDto>;
    userGetDetails(videoId: string | ObjectId, currentUser: UserDto, jwToken: string): Promise<VideoDto>;
    increaseView(id: string | ObjectId): Promise<{
        ok: number;
        n: number;
        nModified: number;
    }>;
    updateInfo(id: string | ObjectId, payload: VideoUpdatePayload, file: FileDto, trailer: FileDto, thumbnail: FileDto, updater?: PerformerDto): Promise<VideoDto>;
    delete(id: string | ObjectId): Promise<boolean>;
    checkAuth(req: Request): Promise<boolean>;
}
