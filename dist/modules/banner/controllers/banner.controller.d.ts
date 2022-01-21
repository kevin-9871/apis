import { DataResponse } from 'src/kernel';
import { BannerSearchRequest } from '../payloads';
import { BannerSearchService } from '../services';
export declare class BannerController {
    private readonly bannerSearchService;
    constructor(bannerSearchService: BannerSearchService);
    search(req: BannerSearchRequest): Promise<DataResponse<import("src/kernel").PageableData<import("../dtos").BannerDto>>>;
}
