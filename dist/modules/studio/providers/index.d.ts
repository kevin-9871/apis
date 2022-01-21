import { Connection } from 'mongoose';
export declare const STUDIO_MODEL_PROVIDER = "STUDIO_MODEL_PROVIDER";
export declare const studioProviders: {
    provide: string;
    useFactory: (connection: Connection) => import("mongoose").Model<import("mongoose").Document<any>>;
    inject: string[];
}[];
