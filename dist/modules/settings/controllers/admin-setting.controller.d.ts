import { DataResponse } from 'src/kernel';
import { SettingService } from '../services';
import { SettingDto } from '../dtos';
import { SettingUpdatePayload } from '../payloads';
export declare class AdminSettingController {
    private readonly settingService;
    constructor(settingService: SettingService);
    getAdminSettings(group: string): Promise<DataResponse<SettingDto[]>>;
    getKeyValueSettings(key: string): Promise<DataResponse<string>>;
    update(key: string, value: SettingUpdatePayload): Promise<DataResponse<SettingDto>>;
}
