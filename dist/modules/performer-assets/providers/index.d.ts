import { Connection } from 'mongoose';
export declare const PERFORMER_VIDEO_MODEL_PROVIDER = "PERFORMER_VIDEO_MODEL_PROVIDER";
export declare const PERFORMER_PHOTO_MODEL_PROVIDER = "PERFORMER_PHOTO_MODEL_PROVIDER";
export declare const PERFORMER_GALLERY_MODEL_PROVIDER = "PERFORMER_GALLERY_MODEL_PROVIDER";
export declare const PERFORMER_PRODUCT_MODEL_PROVIDER = "PERFORMER_PRODUCT_MODEL_PROVIDER";
export declare const assetsProviders: {
    provide: string;
    useFactory: (connection: Connection) => import("mongoose").Model<import("mongoose").Document<any>>;
    inject: string[];
}[];
