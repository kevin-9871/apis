import { ObjectId } from 'mongodb';
export interface CCBillSubscription {
    salt: string;
    flexformId: string;
    subAccountNumber: string;
    price: number;
    transactionId: string | ObjectId;
    subscriptionType: string;
}
export interface CCBillSinglePurchase {
    salt: string;
    flexformId: string;
    subAccountNumber: string;
    transactionId: string | ObjectId;
    price: number;
    currencyCode?: string | number;
}
export declare class CCBillService {
    singlePurchase(options: CCBillSinglePurchase): {
        paymentUrl: string;
    };
}
