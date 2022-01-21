import { Connection } from 'mongoose';
export declare const USER_MODEL_PROVIDER = "USER_MODEL";
export declare const SHIPPING_INFO_PROVIDER = "SHIPPING_INFO_PROVIDER";
export declare const userProviders: {
    provide: string;
    useFactory: (connection: Connection) => import("mongoose").Model<import("mongoose").Document<any>>;
    inject: string[];
}[];
