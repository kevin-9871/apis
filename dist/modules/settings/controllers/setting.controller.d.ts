import { DataResponse } from 'src/kernel';
import { PerformerCommissionService } from 'src/modules/performer/services';
import { PerformerDto } from 'src/modules/performer/dtos';
import { IStudio } from 'src/modules/studio/dtos';
import { SettingService } from '../services';
export declare class SettingController {
    private readonly settingService;
    private readonly performerCommission;
    constructor(settingService: SettingService, performerCommission: PerformerCommissionService);
    getPublicSettings(): Promise<DataResponse<Record<string, any>>>;
    getPerformerCommission(performer: PerformerDto): Promise<DataResponse<any>>;
    getStudioCommission(studio: IStudio): Promise<DataResponse<any>>;
}
