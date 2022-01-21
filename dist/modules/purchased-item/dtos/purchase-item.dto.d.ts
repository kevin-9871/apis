import { ObjectId } from 'mongodb';
export declare class PurchasedItemDto {
    _id: ObjectId;
    sourceInfo?: any;
    source?: string;
    sourceId: ObjectId;
    sellerId?: ObjectId;
    sellerInfo?: any;
    target?: string;
    targetId?: ObjectId;
    targetInfo?: any;
    type?: string;
    name?: string;
    description?: string;
    totalPrice?: number;
    originalPrice?: number;
    quantity?: number;
    status?: string;
    extraInfo?: any;
    createdAt: Date;
    updatedAt: Date;
    constructor(data?: Partial<PurchasedItemDto>);
}
