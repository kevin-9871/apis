import { HttpService } from '@nestjs/common';
import { DataResponse } from 'src/kernel';
import { SettingService } from 'src/modules/settings';
import { TokenCreatePayload, TokenSearchPayload } from '../payloads';
export declare class RequestService {
    private httpService;
    private readonly settingService;
    constructor(httpService: HttpService, settingService: SettingService);
    init(): Promise<string[]>;
    create(data: any): Promise<DataResponse<any>>;
    generateOneTimeToken(id: string, payload: TokenCreatePayload): Promise<DataResponse<any>>;
    removeAllTokenRelateStreamId(id: string): Promise<DataResponse<any>>;
    getAllTokenRelateStreamId(id: string, payload: TokenSearchPayload): Promise<DataResponse<any>>;
    getBroadcast(id: string): Promise<DataResponse<any>>;
}
