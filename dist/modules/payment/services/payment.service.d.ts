import { QueueEventService } from 'src/kernel';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { SettingService } from 'src/modules/settings';
import { OrderModel, PaymentTransactionModel } from '../models';
import { CCBillService } from './ccbill.service';
export declare class PaymentService {
    private readonly PaymentTransactionModel;
    private readonly ccbillService;
    private readonly settingService;
    private readonly queueEventService;
    constructor(PaymentTransactionModel: Model<PaymentTransactionModel>, ccbillService: CCBillService, settingService: SettingService, queueEventService: QueueEventService);
    findById(id: string | ObjectId): Promise<PaymentTransactionModel>;
    private _getCCBillSettings;
    private _createTransactionFromOrder;
    processSinglePayment(order: OrderModel, paymentGateway?: string): Promise<{
        paymentUrl: string;
    }>;
    ccbillSinglePaymentSuccessWebhook(payload: Record<string, any>): Promise<{
        ok: boolean;
    }>;
    ccbillRenewalSuccessWebhook(payload: any): Promise<{
        ok: boolean;
    }>;
}
