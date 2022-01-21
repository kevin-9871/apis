import { Document } from 'mongoose';
export declare class TokenPackageModel extends Document {
    name?: string;
    description?: string;
    ordering?: number;
    price?: number;
    tokens?: number;
    isActive?: boolean;
    pi_code?: string;
    updatedAt?: Date;
    createdAt?: Date;
}
