import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { Request } from 'express';
import { CountryService } from 'src/modules/utils/services';
import { BlockSettingModel } from '../models';
export declare class PerformerBlockSettingService {
    private readonly PerformerBlockSetting;
    private readonly countryService;
    constructor(PerformerBlockSetting: Model<BlockSettingModel>, countryService: CountryService);
    findByPerformerId(performerId: string | ObjectId): Promise<BlockSettingModel>;
    checkBlockByPerformerId(performerId: string | ObjectId, userId: string | ObjectId, req?: Request): Promise<boolean>;
}
