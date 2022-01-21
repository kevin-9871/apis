import { Connection } from 'mongoose';
export declare const PAYOUT_REQUEST_MODEL_PROVIDER = "PAYOUT_REQUEST_MODEL_PROVIDER";
export declare const payoutRequestProviders: {
    provide: string;
    useFactory: (connection: Connection) => import("mongoose").Model<import("mongoose").Document<any>>;
    inject: string[];
}[];
