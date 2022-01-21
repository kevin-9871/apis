import { DataResponse, PageableData } from 'src/kernel';
import { StudioDto } from 'src/modules/studio/dtos';
import { EarningService } from '../services/earning.service';
import { EarningSearchRequestPayload, UpdateEarningStatusPayload } from '../payloads';
import { EarningDto, IEarning, IEarningStatResponse } from '../dtos/earning.dto';
import { UserDto } from '../../user/dtos';
export declare class EarningController {
    private readonly earningService;
    constructor(earningService: EarningService);
    adminSearch(req: EarningSearchRequestPayload, user: UserDto): Promise<DataResponse<PageableData<IEarning>>>;
    search(req: EarningSearchRequestPayload, performer: UserDto): Promise<DataResponse<PageableData<IEarning>>>;
    studioSearch(req: EarningSearchRequestPayload, studio: StudioDto): Promise<DataResponse<PageableData<IEarning>>>;
    adminStats(req: EarningSearchRequestPayload): Promise<DataResponse<IEarningStatResponse>>;
    performerStats(req: EarningSearchRequestPayload, user: UserDto): Promise<DataResponse<IEarningStatResponse>>;
    studioStats(req: EarningSearchRequestPayload, studio: StudioDto): Promise<DataResponse<IEarningStatResponse>>;
    performerPayout(req: EarningSearchRequestPayload, user: UserDto): Promise<DataResponse<IEarningStatResponse>>;
    studioPayout(req: EarningSearchRequestPayload, studio: StudioDto): Promise<DataResponse<IEarningStatResponse>>;
    updateStats(payload: UpdateEarningStatusPayload): Promise<DataResponse<IEarningStatResponse>>;
    details(id: string): Promise<DataResponse<EarningDto>>;
}
