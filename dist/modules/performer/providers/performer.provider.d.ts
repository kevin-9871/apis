import { Connection } from 'mongoose';
export declare const PERFORMER_MODEL_PROVIDER = "PERFORMER_MODEL";
export declare const PERFORMER_CATEGORY_MODEL_PROVIDER = "PERFORMER_CATEGORY_MODEL";
export declare const PERFORMER_BLOCK_SETTING_MODEL_PROVIDER = "PERFORMER_BLOCK_SETTING_MODEL_PROVIDER";
export declare const PERFORMER_COMMISSION_MODEL_PROVIDER = "PERFORMER_COMMISSION_MODEL_PROVIDER";
export declare const performerProviders: {
    provide: string;
    useFactory: (connection: Connection) => import("mongoose").Model<import("mongoose").Document<any>>;
    inject: string[];
}[];
