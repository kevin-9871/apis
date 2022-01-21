import { DataResponse } from 'src/kernel';
import { PerformerDto } from 'src/modules/performer/dtos';
import { PayoutRequestCreatePayload } from '../payloads/payout-request.payload';
import { PayoutRequestService } from '../services/payout-request.service';
export declare class PayoutRequestController {
    private readonly payoutRequestService;
    constructor(payoutRequestService: PayoutRequestService);
    create(payload: PayoutRequestCreatePayload, user: PerformerDto): Promise<DataResponse<any>>;
    update(id: string, payload: PayoutRequestCreatePayload, performer: PerformerDto): Promise<DataResponse<any>>;
    details(id: string, user: PerformerDto): Promise<DataResponse<any>>;
}
