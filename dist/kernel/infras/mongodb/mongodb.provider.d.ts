import * as mongoose from 'mongoose';
export declare const MONGO_DB_PROVIDER = "MONGO_DB_PROVIDER";
export declare const mongoDBProviders: {
    provide: string;
    useFactory: () => Promise<typeof mongoose>;
}[];
