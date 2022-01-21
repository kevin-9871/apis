import { Model } from 'mongoose';
import { PageableData } from 'src/kernel';
import { PerformerService } from 'src/modules/performer/services';
import { FileService } from 'src/modules/file/services';
import { PerformerDto } from 'src/modules/performer/dtos';
import { PaymentTokenService } from 'src/modules/purchased-item/services';
import { UserDto } from 'src/modules/user/dtos';
import { VideoDto } from '../dtos';
import { VideoSearchRequest } from '../payloads';
import { VideoModel } from '../models';
export declare class VideoSearchService {
    private readonly videoModel;
    private readonly performerService;
    private readonly fileService;
    private readonly paymentTokenService;
    constructor(videoModel: Model<VideoModel>, performerService: PerformerService, fileService: FileService, paymentTokenService: PaymentTokenService);
    adminSearch(req: VideoSearchRequest, jwToken: string): Promise<PageableData<VideoDto>>;
    performerSearch(req: VideoSearchRequest, performer: PerformerDto, jwToken: string): Promise<PageableData<VideoDto>>;
    userSearch(req: VideoSearchRequest, user: UserDto, jwToken: string): Promise<PageableData<VideoDto>>;
}
