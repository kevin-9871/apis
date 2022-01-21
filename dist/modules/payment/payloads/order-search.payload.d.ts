import { SearchRequest } from 'src/kernel/common';
export declare class OrderSearchPayload extends SearchRequest {
    buyerId: string;
    sellerId: string;
    deliveryStatus: string;
    fromDate: Date;
    toDate: Date;
}
