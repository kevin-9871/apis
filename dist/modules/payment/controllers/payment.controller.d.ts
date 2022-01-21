import { DataResponse } from 'src/kernel';
import { ObjectId } from 'mongodb';
import { UserDto } from '../../user/dtos';
import { PaymentService } from '../services/payment.service';
import { OrderService } from '../services/order.service';
export declare class PaymentController {
    private readonly paymentService;
    private readonly orderService;
    constructor(paymentService: PaymentService, orderService: OrderService);
    purchaseProducts(user: UserDto, tokenId: string | ObjectId, gateway: string): Promise<DataResponse<any>>;
    ccbillCallhook(payload: Record<string, string>, req: Record<string, string>): Promise<DataResponse<any>>;
}
