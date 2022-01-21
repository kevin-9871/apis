import { SearchRequest } from 'src/kernel/common';
import { ObjectId } from 'mongodb';
export declare class EarningSearchRequestPayload extends SearchRequest {
    performerId: string;
    sourceId: string;
    targetId: string;
    studioId: string;
    type: string;
    source: string;
    target: string;
    fromDate: Date;
    toDate: Date;
    paidAt: Date;
    isPaid: boolean;
}
export interface UpdateEarningStatusPayload {
    targetId: ObjectId;
    fromDate: Date;
    toDate: Date;
}
