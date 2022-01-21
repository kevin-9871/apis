import { DataResponse, PageableData } from 'src/kernel';
import { UserDto } from 'src/modules/user/dtos';
import { PaymentSearchService } from '../services';
import { PaymentSearchPayload } from '../payloads/payment-search.payload';
export declare class PaymentSearchController {
    private readonly paymentService;
    constructor(paymentService: PaymentSearchService);
    adminTranasctions(req: PaymentSearchPayload): Promise<DataResponse<PageableData<any>>>;
    userTranasctions(req: PaymentSearchPayload, user: UserDto): Promise<DataResponse<PageableData<any>>>;
}
