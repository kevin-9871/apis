import { Connection } from 'mongoose';
export declare const MENU_PROVIDER = "MENU_PROVIDER";
export declare const menuProviders: {
    provide: string;
    useFactory: (connection: Connection) => import("mongoose").Model<import("mongoose").Document<any>>;
    inject: string[];
}[];
