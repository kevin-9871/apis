import { ObjectId } from 'mongodb';
export interface IStudio {
    _id: ObjectId;
    name: string;
    username: string;
    email: string;
    status: string;
    phone: string;
    country: string;
    city: string;
    state: string;
    zipcode: string;
    address: string;
    languages: string[];
    roles: string[];
    timezone: string;
    createdAt: Date;
    updatedAt: Date;
    balance: number;
    emailVerified?: boolean;
    stats?: {
        totalPerformer?: number;
        totalHoursOnline?: number;
        totalTokenEarned?: number;
        totalOnlineToday?: number;
        totalTokenSpent?: number;
    };
    documentVerificationId: ObjectId;
    documentVerificationFile: string;
    documentVerification: any;
    commission: number;
}
export declare class StudioDto {
    _id: ObjectId;
    name: string;
    username: string;
    email: string;
    status: string;
    phone: string;
    country: string;
    city: string;
    state: string;
    zipcode: string;
    address: string;
    languages: string[];
    roles: string[];
    timezone: string;
    createdAt: Date;
    updatedAt: Date;
    balance: number;
    emailVerified: boolean;
    stats?: {
        totalPerformer?: number;
        totalHoursOnline?: number;
        totalTokenEarned?: number;
        totalOnlineToday?: number;
        totalTokenSpent?: number;
    };
    documentVerificationId: ObjectId;
    documentVerificationFile: string;
    documentVerification: any;
    commission: number;
    constructor(payload: Partial<StudioDto>);
    toResponse(includePrivateInfo?: boolean): Partial<IStudio>;
}
