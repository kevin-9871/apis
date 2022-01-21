import { Connection } from 'mongoose';
export declare const AUTH_MODEL_PROVIDER = "AUTH_MODEL";
export declare const VERIFICATION_MODEL_PROVIDER = "VERIFICATION_MODEL_PROVIDER";
export declare const FORGOT_MODEL_PROVIDER = "FORGOT_MODEL_PROVIDER";
export declare const authProviders: {
    provide: string;
    useFactory: (connection: Connection) => import("mongoose").Model<import("mongoose").Document<any>>;
    inject: string[];
}[];
