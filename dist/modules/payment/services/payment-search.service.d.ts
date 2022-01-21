import { UserService } from 'src/modules/user/services';
import { UserDto } from 'src/modules/user/dtos';
import { Model } from 'mongoose';
import { PaymentTransactionModel } from '../models';
import { PaymentSearchPayload } from '../payloads';
export declare class PaymentSearchService {
    private readonly paymentTransactionModel;
    private readonly userService;
    constructor(paymentTransactionModel: Model<PaymentTransactionModel>, userService: UserService);
    getUserTransactions(req: PaymentSearchPayload, user: UserDto): Promise<any>;
    adminGetUserTransactions(req: PaymentSearchPayload): Promise<any>;
}
