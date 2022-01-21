import { Connection } from 'mongoose';
export declare const POST_MODEL_PROVIDER = "POST_MODEL";
export declare const POST_META_MODEL_PROVIDER = "POST_META_MODEL";
export declare const POST_CATEGORY_MODEL_PROVIDER = "POST_CATEGORY_MODEL";
export declare const postProviders: {
    provide: string;
    useFactory: (connection: Connection) => import("mongoose").Model<import("mongoose").Document<any>>;
    inject: string[];
}[];
