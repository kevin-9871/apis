export declare class StudioCreatePayload {
    username: string;
    name: string;
    password: string;
    country: string;
    email: string;
}
export declare class StudioCreateByAdminPayload {
    username: string;
    name: string;
    password: string;
    country: string;
    email: string;
    documentVerificationId: any;
    commission: number;
    status: string;
    emailVerified: boolean;
}
