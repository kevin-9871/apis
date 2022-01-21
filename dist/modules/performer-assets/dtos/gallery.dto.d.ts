import { ObjectId } from 'mongodb';
import { GalleryModel } from '../models';
export declare class GalleryDto {
    _id?: ObjectId;
    performerId?: ObjectId;
    type?: string;
    name?: string;
    description?: string;
    status?: string;
    processing?: boolean;
    coverPhotoId?: ObjectId;
    token?: number;
    coverPhoto?: Record<string, any>;
    isBought?: boolean;
    performer?: any;
    createdBy?: ObjectId;
    updatedBy?: ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
    isSale?: boolean;
    constructor(init?: Partial<GalleryDto>);
    static fromModel(model: GalleryModel): GalleryDto;
}
