import { Connection } from 'mongoose';
export declare const BANKING_INFORMATION_MODEL_PROVIDE = "BANKING_INFORMATION_MODEL_PROVIDE";
export declare const paymentInformationProviders: {
    provide: string;
    useFactory: (connection: Connection) => import("mongoose").Model<import("mongoose").Document<any>>;
    inject: string[];
}[];
