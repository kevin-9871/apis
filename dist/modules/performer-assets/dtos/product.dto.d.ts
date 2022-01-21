import { ObjectId } from 'mongodb';
export declare class ProductDto {
    _id?: ObjectId;
    performerId?: ObjectId;
    digitalFileId?: ObjectId;
    imageId?: ObjectId;
    image?: string;
    digitalFile: string;
    type?: string;
    name?: string;
    description?: string;
    publish?: boolean;
    isBought?: boolean;
    status?: string;
    token?: number;
    stock?: number;
    performer?: any;
    createdBy?: ObjectId;
    updatedBy?: ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
    constructor(init?: Partial<ProductDto>);
    toPublic(): Pick<this, "updatedAt" | "_id" | "type" | "name" | "description" | "status" | "createdBy" | "updatedBy" | "createdAt" | "image" | "performerId" | "token" | "isBought" | "performer" | "publish" | "stock">;
}
