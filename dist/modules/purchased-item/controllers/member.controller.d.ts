import { DataResponse } from 'src/kernel';
import { UserDto } from 'src/modules/user/dtos';
import { SendTipsPayload } from '../payloads';
import { PurchaseItemService } from '../services';
export declare class MemberPaymentToken {
    private readonly paymentService;
    constructor(paymentService: PurchaseItemService);
    sendTips(user: UserDto, id: string, payload: SendTipsPayload): Promise<DataResponse<any>>;
    sendPaidToken(user: UserDto, id: string): Promise<DataResponse<any>>;
}
