import { DataResponse, PageableData } from 'src/kernel';
import { UserDto } from 'src/modules/user/dtos';
import { RefundRequestService } from '../services/refund-request.service';
import { RefundRequestDto } from '../dtos/refund-request.dto';
import { RefundRequestCreatePayload, RefundRequestSearchPayload, RefundRequestUpdatePayload } from '../payloads/refund-request.payload';
export declare class RefundRequestController {
    private readonly refundRequestService;
    constructor(refundRequestService: RefundRequestService);
    adminSearch(req: RefundRequestSearchPayload, user: UserDto): Promise<DataResponse<PageableData<RefundRequestDto>>>;
    create(payload: RefundRequestCreatePayload, user: UserDto): Promise<DataResponse<any>>;
    updateStatus(id: string, payload: RefundRequestUpdatePayload): Promise<DataResponse<any>>;
}
