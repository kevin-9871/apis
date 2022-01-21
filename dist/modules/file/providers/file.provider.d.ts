import { Connection } from 'mongoose';
export declare const FILE_MODEL_PROVIDER = "FILE_MODEL_PROVIDER";
export declare const fileProviders: {
    provide: string;
    useFactory: (connection: Connection) => import("mongoose").Model<import("mongoose").Document<any>>;
    inject: string[];
}[];
