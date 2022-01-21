import { DataResponse } from 'src/kernel';
import { PayoutRequestService } from '../services/payout-request.service';
import { PayoutRequestUpdatePayload } from '../payloads/payout-request.payload';
export declare class AdminPayoutRequestController {
    private readonly payoutRequestService;
    constructor(payoutRequestService: PayoutRequestService);
    updateStatus(id: string, payload: PayoutRequestUpdatePayload): Promise<DataResponse<any>>;
    adminDetails(id: string): Promise<DataResponse<any>>;
}
