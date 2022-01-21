import { ObjectId } from 'mongodb';
import { SearchRequest } from 'src/kernel/common';
export declare class RefundRequestCreatePayload {
    sourceType: string;
    sourceId: string;
    performerId: string;
    description: string;
    token: number;
}
export declare class RefundRequestUpdatePayload {
    status: string;
}
export declare class RefundRequestSearchPayload extends SearchRequest {
    performerId?: string | ObjectId;
    userId?: string | ObjectId;
    sourceId?: string | ObjectId;
    sourceType?: string;
    fromDate?: string | Date;
    toDate?: string | Date;
    status?: string;
}
