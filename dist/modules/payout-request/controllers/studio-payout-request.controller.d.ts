import { DataResponse } from 'src/kernel';
import { StudioDto } from 'src/modules/studio/dtos';
import { PerformerService } from 'src/modules/performer/services';
import { UserDto } from 'src/modules/user/dtos';
import { PayoutRequestCreatePayload, PayoutRequestSearchPayload, PayoutRequestUpdatePayload } from '../payloads/payout-request.payload';
import { PayoutRequestService, StudioPayoutRequestService } from '../services';
import { PayoutRequestDto } from '../dtos/payout-request.dto';
export declare class StudioPayoutRequestController {
    private readonly payoutRequestService;
    private readonly memberPayoutRequestService;
    private readonly performerService;
    constructor(payoutRequestService: StudioPayoutRequestService, memberPayoutRequestService: PayoutRequestService, performerService: PerformerService);
    create(payload: PayoutRequestCreatePayload, user: StudioDto): Promise<DataResponse<any>>;
    update(id: string, payload: PayoutRequestCreatePayload, studio: StudioDto): Promise<DataResponse<any>>;
    details(id: string, user: StudioDto): Promise<DataResponse<any>>;
    adminDetails(id: string): Promise<DataResponse<any>>;
    perfomrerRequest(payload: PayoutRequestSearchPayload, studio: StudioDto): Promise<DataResponse<{
        total: number;
        data: PayoutRequestDto[];
    }>>;
    updateMemberRequest(id: string, payload: PayoutRequestUpdatePayload, studio: UserDto): Promise<DataResponse<PayoutRequestDto>>;
}
