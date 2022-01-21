import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { QueueEventService } from 'src/kernel';
import { FileDto } from 'src/modules/file';
import { UserDto } from 'src/modules/user/dtos';
import { FileService } from 'src/modules/file/services';
import { BannerDto } from '../dtos';
import { BannerCreatePayload, BannerUpdatePayload } from '../payloads';
import { BannerModel } from '../models';
export declare class BannerService {
    private readonly bannerModel;
    private readonly fileService;
    private readonly queueEventService;
    constructor(bannerModel: Model<BannerModel>, fileService: FileService, queueEventService: QueueEventService);
    upload(file: FileDto, payload: BannerCreatePayload, creator?: UserDto): Promise<BannerDto>;
    create(payload: BannerCreatePayload, creator?: UserDto): Promise<BannerDto>;
    updateInfo(id: string | ObjectId, payload: BannerUpdatePayload, updater: UserDto): Promise<BannerDto>;
    details(id: string | ObjectId, userDto?: UserDto): Promise<BannerDto>;
    delete(id: string | ObjectId): Promise<boolean>;
}
