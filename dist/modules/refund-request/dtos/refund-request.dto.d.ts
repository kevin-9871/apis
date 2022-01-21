import { ObjectId } from 'mongodb';
export declare class RefundRequestDto {
    _id: any;
    userId: ObjectId;
    sourceType?: string;
    sourceId?: ObjectId;
    token: number;
    performerId: ObjectId;
    description: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    performerInfo?: any;
    userInfo?: any;
    productInfo?: any;
    orderInfo?: any;
    constructor(data?: Partial<RefundRequestDto>);
}
