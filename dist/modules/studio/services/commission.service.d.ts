import { PerformerCommissionDto, PerformerDto } from 'src/modules/performer/dtos';
import { PerformerSearchPayload } from 'src/modules/performer/payloads';
import { PerformerCommissionService, PerformerSearchService, PerformerService } from 'src/modules/performer/services';
import { SettingService } from 'src/modules/settings/services';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { StudioDto } from '../dtos';
import { UpdateCommissionPayload } from '../payloads';
import { StudioModel } from '../models';
export declare class StudioCommissionService {
    private readonly performerCommissionService;
    private readonly performerSearchService;
    private readonly settingService;
    private readonly performerService;
    private readonly studioModel;
    constructor(performerCommissionService: PerformerCommissionService, performerSearchService: PerformerSearchService, settingService: SettingService, performerService: PerformerService, studioModel: Model<StudioModel>);
    searchMemberCommissions(query: PerformerSearchPayload, user: any): Promise<{
        total: number;
        data: Partial<PerformerDto>[];
    }>;
    studioUpdateMemberCommission(id: string, payload: UpdateCommissionPayload, studio: StudioDto): Promise<PerformerCommissionDto>;
    adminUpdateStudioCommission(studioId: string | ObjectId, payload: UpdateCommissionPayload): Promise<StudioModel>;
}
