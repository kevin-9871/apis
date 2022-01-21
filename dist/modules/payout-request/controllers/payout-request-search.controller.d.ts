import { DataResponse, PageableData } from 'src/kernel';
import { UserDto } from 'src/modules/user/dtos';
import { PayoutRequestService } from '../services/payout-request.service';
import { PayoutRequestDto } from '../dtos/payout-request.dto';
import { PayoutRequestSearchPayload } from '../payloads/payout-request.payload';
export declare class PayoutRequestSearchController {
    private readonly payoutRequestService;
    constructor(payoutRequestService: PayoutRequestService);
    adminSearch(req: PayoutRequestSearchPayload, user: UserDto): Promise<DataResponse<PageableData<PayoutRequestDto>>>;
    studioSearch(req: PayoutRequestSearchPayload, user: UserDto): Promise<DataResponse<PageableData<PayoutRequestDto>>>;
    performerSearch(req: PayoutRequestSearchPayload, user: UserDto): Promise<DataResponse<PageableData<PayoutRequestDto>>>;
}
