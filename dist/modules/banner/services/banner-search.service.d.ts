import { Model } from 'mongoose';
import { PageableData } from 'src/kernel';
import { FileService } from 'src/modules/file/services';
import { BannerModel } from '../models';
import { BannerDto } from '../dtos';
import { BannerSearchRequest } from '../payloads';
export declare class BannerSearchService {
    private readonly bannerModel;
    private readonly fileService;
    constructor(bannerModel: Model<BannerModel>, fileService: FileService);
    search(req: BannerSearchRequest): Promise<PageableData<BannerDto>>;
}
