import { ObjectId } from 'mongodb';
export interface ITokenPackage {
    _id: ObjectId;
    name: string;
    description: string;
    ordering: number;
    price: number;
    tokens: number;
    isActive: boolean;
    pi_code: string;
    updatedAt: Date;
    createdAt: Date;
}
export declare class TokenPackageDto {
    _id: ObjectId;
    name: string;
    description: string;
    ordering: number;
    price: number;
    tokens: number;
    isActive: boolean;
    pi_code: string;
    updatedAt: Date;
    createdAt: Date;
    constructor(data: Partial<ITokenPackage>);
    toResponse(): {
        _id: ObjectId;
        name: string;
        description: string;
        ordering: number;
        price: number;
        tokens: number;
        isActive: boolean;
        pi_code: string;
        updatedAt: Date;
        createdAt: Date;
    };
}
