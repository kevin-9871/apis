import { Connection } from 'mongoose';
export declare const EARNING_MODEL_PROVIDER = "EARNING_MODEL_PROVIDER";
export declare const earningProviders: {
    provide: string;
    useFactory: (connection: Connection) => import("mongoose").Model<import("mongoose").Document<any>>;
    inject: string[];
}[];
