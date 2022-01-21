import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { UpdateCommissionPayload } from 'src/modules/studio/payloads';
import { SettingService } from 'src/modules/settings';
import { PerformerCommissionPayload } from '../payloads';
import { PerformerCommissionModel } from '../models';
import { PerformerService } from './performer.service';
import { ICommissionSetting, PerformerCommissionDto } from '../dtos';
export declare class PerformerCommissionService {
    private readonly PerformerCommissionModel;
    private readonly performerService;
    private readonly settingService;
    constructor(PerformerCommissionModel: Model<PerformerCommissionModel>, performerService: PerformerService, settingService: SettingService);
    findOne(params: any): Promise<PerformerCommissionModel>;
    findByPerformerIds(ids: ObjectId[]): Promise<PerformerCommissionModel[]>;
    create(performerId: string | ObjectId, payload: ICommissionSetting): Promise<PerformerCommissionModel>;
    update(payload: PerformerCommissionPayload, performerId: ObjectId): Promise<PerformerCommissionModel>;
    studioUpdate(id: string, payload: UpdateCommissionPayload, studioId: ObjectId): Promise<PerformerCommissionDto>;
}
