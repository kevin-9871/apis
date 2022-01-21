import { Connection } from 'mongoose';
export declare const EMAIL_TEMPLATE_PROVIDER = "EMAIL_TEMPLATE_PROVIDER";
export declare const emailTemplateProviders: {
    provide: string;
    useFactory: (connection: Connection) => import("mongoose").Model<import("mongoose").Document<any>>;
    inject: string[];
}[];
