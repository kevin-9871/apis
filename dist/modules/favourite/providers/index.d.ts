import { Connection } from 'mongoose';
export declare const FAVOURITE_MODEL_PROVIDER = "FAVOURITE_MODEL_PROVIDER";
export declare const assetsProviders: {
    provide: string;
    useFactory: (connection: Connection) => import("mongoose").Model<import("mongoose").Document<any>>;
    inject: string[];
}[];
