import { Connection } from 'mongoose';
export declare const BANNER_PROVIDER = "BANNER_PROVIDER";
export declare const bannerProviders: {
    provide: string;
    useFactory: (connection: Connection) => import("mongoose").Model<import("mongoose").Document<any>>;
    inject: string[];
}[];
