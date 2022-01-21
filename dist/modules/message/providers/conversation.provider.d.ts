import { Connection } from 'mongoose';
export declare const CONVERSATION_MODEL_PROVIDER = "CONVERSATION_MODEL_PROVIDER";
export declare const conversationProviders: {
    provide: string;
    useFactory: (connection: Connection) => import("mongoose").Model<import("mongoose").Document<any>>;
    inject: string[];
}[];
