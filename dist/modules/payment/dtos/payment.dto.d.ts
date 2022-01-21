import { ObjectId } from 'mongodb';
export interface PaymentProduct {
    name?: string;
    description?: string;
    price?: number | string;
    extraInfo?: any;
    productType?: string;
    productId?: string | ObjectId;
    quantity?: number;
}
export interface DigitalProductResponse {
    digitalFileUrl?: any;
    digitalFileId?: any;
    _id?: string | ObjectId;
}
export declare class PaymentDto {
    _id: ObjectId;
    paymentGateway?: string;
    buyerInfo?: any;
    buyerSource?: string;
    buyerId: ObjectId;
    sellerSource?: string;
    sellerId?: ObjectId;
    type?: string;
    products?: PaymentProduct[];
    paymentResponseInfo?: any;
    totalPrice?: number;
    status?: string;
    createdAt: Date;
    updatedAt: Date;
    constructor(data?: Partial<PaymentDto>);
    toResponse(includePrivateInfo?: boolean): any;
}
