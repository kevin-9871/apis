import { Model } from 'mongoose';
import { QueueEventService } from 'src/kernel';
import { SettingModel } from '../models';
import { SettingCreatePayload, SettingUpdatePayload } from '../payloads';
import { SettingDto } from '../dtos';
import { MenuModel } from '../../menu/models';
export declare class SettingService {
    private readonly menuModel;
    private readonly settingModel;
    private readonly queueEventService;
    static _settingCache: Map<string, any>;
    static _publicSettingsCache: Record<string, any>;
    constructor(menuModel: Model<MenuModel>, settingModel: Model<SettingModel>, queueEventService: QueueEventService);
    private publishChange;
    private subscribeChange;
    syncCache(): Promise<void>;
    get(key: string): Promise<SettingDto>;
    getKeyValue(key: string): Promise<any>;
    create(data: SettingCreatePayload): Promise<SettingModel>;
    update(key: string, data: SettingUpdatePayload): Promise<SettingDto>;
    getPublicSettings(): Promise<Record<string, any>>;
    getPublicMenus(): Promise<MenuModel[]>;
    getEditableSettings(group?: string): Promise<SettingDto[]>;
    static getByKey(key: string): any;
    static getValueByKey(key: string): any;
}
