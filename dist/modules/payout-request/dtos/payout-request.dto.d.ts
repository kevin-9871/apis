import { ObjectId } from 'mongodb';
export declare class PayoutRequestDto {
    _id: any;
    source: string;
    sourceId: ObjectId;
    performerId?: ObjectId;
    performerInfo?: any;
    studioId?: ObjectId;
    studioRequestId: ObjectId;
    studioInfo?: any;
    paymentAccountInfo?: any;
    paymentAccountType: string;
    fromDate: Date;
    toDate: Date;
    requestNote: string;
    adminNote?: string;
    status: string;
    sourceType: string;
    tokenMustPay: number;
    previousPaidOut: number;
    pendingToken: number;
    sourceInfo: any;
    createdAt: Date;
    updatedAt: Date;
    constructor(data?: Partial<PayoutRequestDto>);
}
