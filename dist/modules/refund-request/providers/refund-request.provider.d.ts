import { Connection } from 'mongoose';
export declare const REFUND_REQUEST_MODEL_PROVIDER = "REFUND_REQUEST_MODEL_PROVIDER";
export declare const refundRequestProviders: {
    provide: string;
    useFactory: (connection: Connection) => import("mongoose").Model<import("mongoose").Document<any>>;
    inject: string[];
}[];
