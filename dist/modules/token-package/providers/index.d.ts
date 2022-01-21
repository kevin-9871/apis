import { Connection } from 'mongoose';
export declare const TOKEN_PACKAGE_MODEL_PROVIDER = "STREAM_MODEL_PROVIDER";
export declare const assetsProviders: {
    provide: string;
    useFactory: (connection: Connection) => import("mongoose").Model<import("mongoose").Document<any>>;
    inject: string[];
}[];
