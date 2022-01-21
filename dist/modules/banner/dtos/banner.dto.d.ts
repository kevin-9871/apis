import { ObjectId } from 'mongodb';
export declare class BannerDto {
    _id?: ObjectId;
    fileId?: ObjectId;
    title?: string;
    description?: string;
    status?: string;
    href?: string;
    position?: string;
    processing?: boolean;
    photo?: any;
    type: string;
    contentHTML: string;
    createdAt?: Date;
    updatedAt?: Date;
    constructor(init?: Partial<BannerDto>);
}
