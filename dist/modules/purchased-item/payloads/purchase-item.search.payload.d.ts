import { SearchRequest } from 'src/kernel/common';
export declare class PaymentTokenSearchPayload extends SearchRequest {
    source: string;
    sourceId: string;
    targetId: string;
    performerId: string;
    sellerId: string;
    status: string;
    type: string;
    target: string;
    fromDate: Date;
    toDate: Date;
    shippingStatus: string;
    orderStatus: string;
}
