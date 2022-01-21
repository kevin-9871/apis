import { Connection } from 'mongoose';
export declare const NOTIFICATION_MESSAGE_MODEL_PROVIDER = "NOTIFICATION_MESSAGE_MODEL_PROVIDER";
export declare const notificationMessageProviders: {
    provide: string;
    useFactory: (connection: Connection) => import("mongoose").Model<import("mongoose").Document<any>>;
    inject: string[];
}[];
