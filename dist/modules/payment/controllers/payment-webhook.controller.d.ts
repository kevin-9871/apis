import { DataResponse } from 'src/kernel';
import { PaymentService } from '../services/payment.service';
export declare class PaymentWebhookController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    ccbillCallhook(payload: Record<string, string>, req: Record<string, string>): Promise<DataResponse<any>>;
}
