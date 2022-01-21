import { ObjectId } from 'mongodb';
export interface IEarning {
    _id: ObjectId;
    userId: ObjectId;
    userInfo: any;
    transactionTokenId: ObjectId;
    transactionInfo: any;
    performerId: ObjectId;
    performerInfo: any;
    source: string;
    target: string;
    type: string;
    grossPrice: number;
    netPrice: number;
    commission: number;
    isPaid: boolean;
    createdAt: Date;
    updatedAt: Date;
    paidAt: Date;
    sourceId: ObjectId;
    targetId: ObjectId;
    transactionStatus: string;
    sourceInfo: any;
    targetInfo: any;
    conversionRate?: number;
    sourceType: string;
}
export declare class EarningDto {
    _id: ObjectId;
    userId: ObjectId;
    userInfo: any;
    transactionTokenId: ObjectId;
    transactionInfo: any;
    performerId: ObjectId;
    performerInfo: any;
    source: string;
    target: string;
    type: string;
    grossPrice: number;
    netPrice: number;
    commission: number;
    isPaid: boolean;
    createdAt: Date;
    updatedAt: Date;
    paidAt: Date;
    sourceId: ObjectId;
    targetId: ObjectId;
    transactionStatus: string;
    sourceInfo: any;
    targetInfo: any;
    conversionRate: number;
    sourceType: string;
    price: number;
    constructor(data?: Partial<EarningDto>);
    toResponse(includePrivate?: boolean): IEarning;
}
export interface IEarningStatResponse {
    totalPrice: number;
    paidPrice: number;
    remainingPrice: number;
}
