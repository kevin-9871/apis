import { Model } from 'mongoose';
import { PageableData } from 'src/kernel/common';
import { FavouriteService } from 'src/modules/favourite/services';
import { UserDto } from 'src/modules/user/dtos';
import { StudioService } from 'src/modules/studio/services';
import { PerformerSearchPayload } from '../payloads';
import { IPerformerResponse } from '../dtos';
import { PerformerModel, BlockSettingModel } from '../models';
export declare class PerformerSearchService {
    private readonly performerModel;
    private readonly favoriteService;
    private readonly blockSettingModel;
    private readonly studioService;
    constructor(performerModel: Model<PerformerModel>, favoriteService: FavouriteService, blockSettingModel: Model<BlockSettingModel>, studioService: StudioService);
    search(req: PerformerSearchPayload, user?: UserDto): Promise<PageableData<IPerformerResponse>>;
    advancedSearch(req: PerformerSearchPayload, user?: UserDto, countryCode?: string): Promise<PageableData<IPerformerResponse>>;
    searchByKeyword(req: any): Promise<import("mongoose").LeanDocument<PerformerModel>[]>;
    randomSelect(size: number): Promise<PageableData<any>>;
}
