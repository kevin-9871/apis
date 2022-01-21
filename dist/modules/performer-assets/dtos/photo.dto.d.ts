import { ObjectId } from 'mongodb';
export interface PerformerPhotoResponse {
    _id?: ObjectId;
    performerId?: ObjectId;
    galleryId?: ObjectId;
    fileId?: ObjectId;
    photo?: any;
    type?: string;
    title?: string;
    description?: string;
    status?: string;
    processing?: boolean;
    performer?: any;
    gallery?: any;
    createdBy?: ObjectId;
    updatedBy?: ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare class PhotoDto {
    _id?: ObjectId;
    performerId?: ObjectId;
    galleryId?: ObjectId;
    fileId?: ObjectId;
    photo?: any;
    type?: string;
    title?: string;
    description?: string;
    status?: string;
    processing?: boolean;
    performer?: any;
    gallery?: any;
    createdBy?: ObjectId;
    updatedBy?: ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
    constructor(init?: Partial<PhotoDto>);
    toPublic(): PerformerPhotoResponse;
}
