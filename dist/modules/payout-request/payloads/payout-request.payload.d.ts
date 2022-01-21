import { SearchRequest } from 'src/kernel/common';
export declare class PayoutRequestCreatePayload {
    paymentAccountType: string;
    sourceType: string;
    fromDate: Date;
    toDate: Date;
    requestNote: string;
}
export declare class PayoutRequestUpdatePayload {
    status: string;
    adminNote: string;
}
export declare class PayoutRequestSearchPayload extends SearchRequest {
    performerId: string;
    studioId: string;
    sourceId: string;
    paymentAccountType?: string;
    fromDate: Date;
    toDate: Date;
    status: string;
    sourceType: string;
}
