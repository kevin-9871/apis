import { Connection } from 'mongoose';
export declare const AGGREGATOR_PERFORMER_INFO_MODEL_PROVIDER = "AGGREGATOR_PERFORMER_INFO_MODEL_PROVIDER";
export declare const AGGREGATOR_TAG_MODEL_PROVIDER = "AGGREGATOR_TAG_MODEL_PROVIDER";
export declare const camAggregatorProviders: {
    provide: string;
    useFactory: (connection: Connection) => import("mongoose").Model<import("mongoose").Document<any>>;
    inject: string[];
}[];
