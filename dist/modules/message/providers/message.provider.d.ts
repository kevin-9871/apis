import { Connection } from 'mongoose';
export declare const MESSAGE_MODEL_PROVIDER = "MESSAGE_MODEL_PROVIDER";
export declare const messageProviders: {
    provide: string;
    useFactory: (connection: Connection) => import("mongoose").Model<import("mongoose").Document<any>>;
    inject: string[];
}[];
