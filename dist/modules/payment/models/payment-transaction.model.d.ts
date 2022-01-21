import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';
export declare class PaymentProductModel {
    name?: string;
    description?: string;
    price?: number | string;
    extraInfo?: any;
    productType?: string;
    productId?: string | ObjectId;
    quantity?: number;
}
export declare class PaymentTransactionModel extends Document {
    orderId?: string | ObjectId;
    paymentGateway: string;
    buyerSource: string;
    buyerId: ObjectId;
    type: string;
    totalPrice: number;
    products: PaymentProductModel[];
    paymentResponseInfo: any;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
