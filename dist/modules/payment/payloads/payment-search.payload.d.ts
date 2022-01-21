import { SearchRequest } from 'src/kernel/common';
export declare class PaymentSearchPayload extends SearchRequest {
    source: string;
    sourceId: string;
    targetId: string;
    performerId: string;
    status: string;
    type: string;
    target: string;
    paymentGateway: string;
    fromDate: Date;
    toDate: Date;
}
