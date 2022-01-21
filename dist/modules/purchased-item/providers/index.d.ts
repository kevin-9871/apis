import { Connection } from 'mongoose';
export declare const PURCHASE_ITEM_MODEL_PROVIDER = "PURCHASE_ITEM_MODEL_PROVIDER";
export declare const paymentTokenProviders: {
    provide: string;
    useFactory: (connection: Connection) => import("mongoose").Model<import("mongoose").Document<any>>;
    inject: string[];
}[];
