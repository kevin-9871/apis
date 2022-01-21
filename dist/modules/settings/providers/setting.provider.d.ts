import { Connection } from 'mongoose';
export declare const SETTING_MODEL_PROVIDER = "SETTING_MODEL_PROVIDER";
export declare const settingProviders: {
    provide: string;
    useFactory: (connection: Connection) => import("mongoose").Model<import("mongoose").Document<any>>;
    inject: string[];
}[];
