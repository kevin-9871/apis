import { Response, Request as Req } from 'express';
import { DataResponse, PageableData, QueueEventService } from 'src/kernel';
import { AuthService } from 'src/modules/auth/services';
import { FileDto } from 'src/modules/file';
import { UserDto } from 'src/modules/user/dtos';
import { FavouriteService } from 'src/modules/favourite/services';
import { SettingService } from 'src/modules/settings';
import { CountryService } from 'src/modules/utils/services';
import { FileService } from 'src/modules/file/services';
import { PerformerBroadcastSetting } from '../payloads/performer-broadcast-setting.payload';
import { PerformerDto, IPerformerResponse, BlockSettingDto } from '../dtos';
import { PerformerUpdatePayload, PerformerSearchPayload, PerformerStreamingStatusUpdatePayload, BlockSettingPayload, DefaultPricePayload } from '../payloads';
import { PerformerService, PerformerSearchService } from '../services';
export declare class PerformerController {
    private readonly authService;
    private readonly performerService;
    private readonly performerSearchService;
    private readonly favoriteService;
    private readonly settingService;
    private readonly countryService;
    private readonly fileService;
    private readonly queueEventService;
    constructor(authService: AuthService, performerService: PerformerService, performerSearchService: PerformerSearchService, favoriteService: FavouriteService, settingService: SettingService, countryService: CountryService, fileService: FileService, queueEventService: QueueEventService);
    me(request: Req): Promise<DataResponse<IPerformerResponse>>;
    usearch(req: PerformerSearchPayload, user: UserDto, request: Req): Promise<DataResponse<PageableData<IPerformerResponse>>>;
    updatePerformer(currentPerformer: PerformerDto, payload: PerformerUpdatePayload, request: Req): Promise<DataResponse<IPerformerResponse>>;
    getDetails(performerUsername: string, req: Req, user: UserDto): Promise<DataResponse<Partial<PerformerDto>>>;
    uploadPerformerDocument(file: FileDto, performer: PerformerDto, request: Req): Promise<any>;
    uploadPerformerReleaseForm(file: FileDto, performer: PerformerDto, request: Req): Promise<any>;
    increaseView(performerId: string): Promise<DataResponse<any>>;
    uploadPerformerAvatar(file: FileDto, performer: PerformerDto): Promise<any>;
    updateBlockSetting(payload: BlockSettingPayload, performer: PerformerDto): Promise<DataResponse<import("../models").BlockSettingModel>>;
    getBlockSetting(performer: PerformerDto): Promise<DataResponse<BlockSettingDto>>;
    checkBlock(performerId: string, req: Req, user: UserDto): Promise<DataResponse<any>>;
    updateStreamingStatus(currentPerformer: PerformerDto, payload: PerformerStreamingStatusUpdatePayload): Promise<DataResponse<IPerformerResponse>>;
    updateDefaultPrice(currentPerformer: PerformerDto, payload: DefaultPricePayload): Promise<DataResponse<IPerformerResponse>>;
    updateBroadcastSetting(currentPerformer: PerformerDto, payload: PerformerBroadcastSetting): Promise<DataResponse<IPerformerResponse>>;
    suspendAccount(currentPerformer: PerformerDto, id: string): Promise<DataResponse<IPerformerResponse>>;
    checkAuth(request: Req, response: Response): Promise<Response>;
    getRandPerformer(size: string): Promise<DataResponse<PageableData<any>>>;
}
