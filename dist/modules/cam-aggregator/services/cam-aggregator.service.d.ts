import { Model } from 'mongoose';
import { AgendaService } from 'src/kernel';
import { SettingService } from 'src/modules/settings';
import { XLoveCamService } from './xlovecam.service';
import { ChaturbateService } from './chaturbate.service';
import { AggregatorPerformerInfoModel } from '../models/aggregator-performer-info.model';
import { BongacamsService } from './bongacams.service';
import { StripcashService } from './stripcash.service';
import { AggregatorCategoryModel } from '../models/aggregator-category.model';
export declare class CamAggregatorService {
    private readonly settingService;
    private readonly xLoveCamService;
    private readonly chaturbateService;
    private readonly bongaCamsService;
    private readonly stripcashService;
    private readonly agendaService;
    private readonly aggregatorPerformerModel;
    private readonly aggregatorCategoryModel;
    constructor(settingService: SettingService, xLoveCamService: XLoveCamService, chaturbateService: ChaturbateService, bongaCamsService: BongacamsService, stripcashService: StripcashService, agendaService: AgendaService, aggregatorPerformerModel: Model<AggregatorPerformerInfoModel>, aggregatorCategoryModel: Model<AggregatorCategoryModel>);
    private defineJobs;
    static detectCountry(text: string): {
        name: string;
        code: string;
        capital: string;
        region: string;
        currency: {
            code: string;
            name: string;
            symbol: string;
        };
        language: {
            code: string;
            name: string;
            iso639_2?: undefined;
            nativeName?: undefined;
        };
        flag: string;
        demonym?: undefined;
    } | {
        name: string;
        code: string;
        capital: string;
        region: string;
        currency: {
            code: string;
            name: string;
            symbol: string;
        };
        language: {
            code: string;
            iso639_2: string;
            name: string;
            nativeName: string;
        };
        flag: string;
        demonym?: undefined;
    } | {
        name: string;
        code: string;
        capital: string;
        region: string;
        demonym: string;
        currency: {
            code: string;
            name: string;
            symbol: string;
        };
        language: {
            code: string;
            name: string;
            iso639_2?: undefined;
            nativeName?: undefined;
        };
        flag: string;
    };
    getCategories(query?: {}): Promise<AggregatorCategoryModel[]>;
    getCategory(id: string): Promise<AggregatorCategoryModel>;
    updateCategory(id: string, payload: any): Promise<AggregatorCategoryModel>;
    listOnline(options?: any): Promise<any>;
    getDetails(key: string, username: string): Promise<AggregatorPerformerInfoModel>;
    getRelatedCams(username: string, options?: any): Promise<any[]>;
    private syncXLoveCamsModels;
    private syncBongaCamsModels;
    private syncChaturbateModels;
    private syncStripcashodels;
    syncTags(): Promise<void>;
}
